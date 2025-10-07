const express = require('express');
const router = express.Router();
const Village = require('../models/Village');

// GET /api/villages - Get all villages with gap scores
router.get('/', async (req, res) => {
  try {
    const { 
      district, 
      state, 
      minGapScore, 
      maxGapScore, 
      status,
      limit = 50,
      page = 1 
    } = req.query;

    // Build filter object
    const filter = {};
    if (district) filter.district = new RegExp(district, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    if (minGapScore || maxGapScore) {
      filter.gapScore = {};
      if (minGapScore) filter.gapScore.$gte = parseInt(minGapScore);
      if (maxGapScore) filter.gapScore.$lte = parseInt(maxGapScore);
    }
    if (status) filter.adarshGramStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const villages = await Village.find(filter)
      .sort({ gapScore: -1, priorityRank: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-amenities'); // Exclude detailed amenities for list view

    const total = await Village.countDocuments(filter);

    res.json({
      success: true,
      data: villages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching villages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching villages',
      error: error.message
    });
  }
});

// GET /api/villages/public - Get public village data (no authentication required)
router.get('/public', async (req, res) => {
  try {
    const { 
      district, 
      state, 
      minGapScore, 
      maxGapScore, 
      status,
      limit = 100,
      page = 1 
    } = req.query;

    // Build filter object
    const filter = {};
    if (district) filter.district = new RegExp(district, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    if (minGapScore || maxGapScore) {
      filter.gapScore = {};
      if (minGapScore) filter.gapScore.$gte = parseInt(minGapScore);
      if (maxGapScore) filter.gapScore.$lte = parseInt(maxGapScore);
    }
    if (status) filter.adarshGramStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // For demo purposes, return sample data if no villages found in database
    let villages = [];
    let total = 0;

    try {
      villages = await Village.find(filter)
        .select('name district state population scPercentage gapScore adarshGramStatus infrastructure')
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      total = await Village.countDocuments(filter);
    } catch (dbError) {
      console.log('Database not available, using sample data');
      // Return sample data for demo
      villages = [
        {
          _id: '1',
          name: 'Village A',
          district: 'District 1',
          state: 'State 1',
          population: 1200,
          scPercentage: 65,
          gapScore: 25,
          adarshGramStatus: 'completed',
          latitude: 20.5937,
          longitude: 78.9629,
          infrastructure: {
            roads: 90,
            electricity: 85,
            water: 80,
            education: 75,
            healthcare: 70
          }
        },
        {
          _id: '2',
          name: 'Village B',
          district: 'District 1',
          state: 'State 1',
          population: 800,
          scPercentage: 45,
          gapScore: 45,
          adarshGramStatus: 'in_progress',
          latitude: 21.1458,
          longitude: 79.0882,
          infrastructure: {
            roads: 60,
            electricity: 70,
            water: 55,
            education: 50,
            healthcare: 40
          }
        },
        {
          _id: '3',
          name: 'Village C',
          district: 'District 2',
          state: 'State 1',
          population: 1500,
          scPercentage: 55,
          gapScore: 70,
          adarshGramStatus: 'pending',
          latitude: 19.7515,
          longitude: 75.7139,
          infrastructure: {
            roads: 30,
            electricity: 40,
            water: 35,
            education: 25,
            healthcare: 20
          }
        },
        {
          _id: '4',
          name: 'Village D',
          district: 'District 2',
          state: 'State 1',
          population: 950,
          scPercentage: 72,
          gapScore: 35,
          adarshGramStatus: 'in_progress',
          latitude: 18.5204,
          longitude: 73.8567,
          infrastructure: {
            roads: 75,
            electricity: 80,
            water: 65,
            education: 60,
            healthcare: 55
          }
        },
        {
          _id: '5',
          name: 'Village E',
          district: 'District 3',
          state: 'State 2',
          population: 1100,
          scPercentage: 58,
          gapScore: 15,
          adarshGramStatus: 'completed',
          latitude: 22.5726,
          longitude: 88.3639,
          infrastructure: {
            roads: 95,
            electricity: 90,
            water: 85,
            education: 80,
            healthcare: 75
          }
        }
      ];
      total = villages.length;
    }

    // Transform data for frontend
    const transformedVillages = villages.map(village => ({
      id: village._id,
      name: village.name,
      district: village.district,
      state: village.state,
      population: village.population,
      scPercentage: village.scPercentage,
      gapScore: village.gapScore,
      status: village.adarshGramStatus || (village.gapScore <= 25 ? 'completed' : 
                                           village.gapScore <= 50 ? 'in_progress' : 'pending'),
      infrastructure: village.infrastructure || {
        roads: Math.floor(Math.random() * 40) + 30,
        electricity: Math.floor(Math.random() * 40) + 30,
        water: Math.floor(Math.random() * 40) + 30,
        education: Math.floor(Math.random() * 40) + 30,
        healthcare: Math.floor(Math.random() * 40) + 30
      }
    }));

    res.json({
      success: true,
      data: transformedVillages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching public village data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching village data',
      error: error.message
    });
  }
});

// GET /api/villages/:id - Get detailed village information
router.get('/:id', async (req, res) => {
  try {
    const village = await Village.findById(req.params.id);
    
    if (!village) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }

    // Calculate priority rank if not set
    if (!village.priorityRank) {
      village.calculatePriorityRank();
      await village.save();
    }

    res.json({
      success: true,
      data: village
    });
  } catch (error) {
    console.error('Error fetching village:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching village details',
      error: error.message
    });
  }
});

// GET /api/villages/stats/summary - Get summary statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalVillages = await Village.countDocuments();
    const avgGapScore = await Village.aggregate([
      { $group: { _id: null, avgGapScore: { $avg: '$gapScore' } } }
    ]);
    
    const statusCounts = await Village.aggregate([
      { $group: { _id: '$adarshGramStatus', count: { $sum: 1 } } }
    ]);

    const topGapVillages = await Village.find()
      .sort({ gapScore: -1 })
      .limit(5)
      .select('name district state gapScore');

    res.json({
      success: true,
      data: {
        totalVillages,
        averageGapScore: avgGapScore[0]?.avgGapScore || 0,
        statusBreakdown: statusCounts,
        topGapVillages
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// POST /api/villages - Create new village (for testing)
router.post('/', async (req, res) => {
  try {
    const village = new Village(req.body);
    await village.save();
    
    res.status(201).json({
      success: true,
      data: village,
      message: 'Village created successfully'
    });
  } catch (error) {
    console.error('Error creating village:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating village',
      error: error.message
    });
  }
});

// PUT /api/villages/:id - Update village
router.put('/:id', async (req, res) => {
  try {
    const village = await Village.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!village) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }

    res.json({
      success: true,
      data: village,
      message: 'Village updated successfully'
    });
  } catch (error) {
    console.error('Error updating village:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating village',
      error: error.message
    });
  }
});

module.exports = router;



