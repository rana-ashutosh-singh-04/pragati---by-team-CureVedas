const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Village = require('../models/Village');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.json', '.geojson'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, JSON, and GeoJSON files are allowed'));
    }
  }
});

// POST /api/upload/csv - Upload and process CSV file
router.post('/csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const results = [];
    const errors = [];

    // Read and parse CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        try {
          // Validate required fields
          const requiredFields = ['name', 'district', 'state', 'latitude', 'longitude', 'totalPopulation', 'scPopulation'];
          const missingFields = requiredFields.filter(field => !data[field]);
          
          if (missingFields.length > 0) {
            errors.push(`Row missing fields: ${missingFields.join(', ')}`);
            return;
          }

          // Parse and validate data
          const villageData = {
            name: data.name.trim(),
            district: data.district.trim(),
            state: data.state.trim(),
            pincode: data.pincode || '',
            coordinates: {
              latitude: parseFloat(data.latitude),
              longitude: parseFloat(data.longitude)
            },
            population: {
              total: parseInt(data.totalPopulation),
              scPopulation: parseInt(data.scPopulation),
              scPercentage: Math.round((parseInt(data.scPopulation) / parseInt(data.totalPopulation)) * 100)
            },
            amenities: {
              education: parseAmenities(data.education),
              healthcare: parseAmenities(data.healthcare),
              water: parseAmenities(data.water),
              sanitation: parseAmenities(data.sanitation),
              electricity: parseAmenities(data.electricity),
              roads: parseAmenities(data.roads),
              connectivity: parseAmenities(data.connectivity),
              banking: parseAmenities(data.banking),
              market: parseAmenities(data.market)
            },
            adarshGramStatus: data.adarshGramStatus || 'not-started',
            createdBy: req.user?.email || 'upload'
          };

          results.push(villageData);
        } catch (error) {
          errors.push(`Error parsing row: ${error.message}`);
        }
      })
      .on('end', async () => {
        try {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          if (results.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No valid data found in CSV file',
              errors
            });
          }

          // Insert villages into database
          const insertedVillages = await Village.insertMany(results, { ordered: false });
          
          res.json({
            success: true,
            message: `Successfully uploaded ${insertedVillages.length} villages`,
            data: {
              inserted: insertedVillages.length,
              errors: errors.length,
              errorDetails: errors.slice(0, 10) // Show first 10 errors
            }
          });
        } catch (error) {
          console.error('Error inserting villages:', error);
          res.status(500).json({
            success: false,
            message: 'Error processing uploaded data',
            error: error.message
          });
        }
      });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
});

// POST /api/upload/geojson - Upload and process GeoJSON file
router.post('/geojson', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const geoData = JSON.parse(fileContent);

    if (!geoData.features || !Array.isArray(geoData.features)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GeoJSON format'
      });
    }

    const results = [];
    const errors = [];

    geoData.features.forEach((feature, index) => {
      try {
        const properties = feature.properties;
        const geometry = feature.geometry;

        if (!properties.name || !geometry.coordinates) {
          errors.push(`Feature ${index + 1}: Missing required properties`);
          return;
        }

        // Extract coordinates (assuming Point geometry)
        const [longitude, latitude] = geometry.coordinates;

        const villageData = {
          name: properties.name,
          district: properties.district || 'Unknown',
          state: properties.state || 'Unknown',
          pincode: properties.pincode || '',
          coordinates: { latitude, longitude },
          population: {
            total: properties.totalPopulation || 1000,
            scPopulation: properties.scPopulation || 500,
            scPercentage: properties.scPercentage || 50
          },
          amenities: {
            education: parseAmenities(properties.education),
            healthcare: parseAmenities(properties.healthcare),
            water: parseAmenities(properties.water),
            sanitation: parseAmenities(properties.sanitation),
            electricity: parseAmenities(properties.electricity),
            roads: parseAmenities(properties.roads),
            connectivity: parseAmenities(properties.connectivity),
            banking: parseAmenities(properties.banking),
            market: parseAmenities(properties.market)
          },
          adarshGramStatus: properties.adarshGramStatus || 'not-started',
          createdBy: req.user?.email || 'upload'
        };

        results.push(villageData);
      } catch (error) {
        errors.push(`Feature ${index + 1}: ${error.message}`);
      }
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid features found in GeoJSON file',
        errors
      });
    }

    // Insert villages into database
    const insertedVillages = await Village.insertMany(results, { ordered: false });

    res.json({
      success: true,
      message: `Successfully uploaded ${insertedVillages.length} villages from GeoJSON`,
      data: {
        inserted: insertedVillages.length,
        errors: errors.length,
        errorDetails: errors.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error uploading GeoJSON:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing GeoJSON file',
      error: error.message
    });
  }
});

// Helper function to parse amenities from string
function parseAmenities(amenityString) {
  if (!amenityString) return [];
  
  try {
    // If it's already an array, return it
    if (Array.isArray(amenityString)) return amenityString;
    
    // If it's a JSON string, parse it
    if (typeof amenityString === 'string') {
      return JSON.parse(amenityString);
    }
    
    return [];
  } catch (error) {
    // If parsing fails, create default amenities
    return [
      { name: 'Primary School', available: false, quality: 'fair' },
      { name: 'Health Center', available: false, quality: 'fair' },
      { name: 'Water Supply', available: false, quality: 'fair' }
    ];
  }
}

module.exports = router;




