const mongoose = require('mongoose');
const Village = require('../models/Village');
require('dotenv').config();

const mockVillages = [
  {
    name: 'Rampur',
    district: 'Bareilly',
    state: 'Uttar Pradesh',
    pincode: '243001',
    coordinates: { latitude: 28.3670, longitude: 79.4304 },
    population: { total: 2500, scPopulation: 1500, scPercentage: 60 },
    amenities: {
      education: [
        { name: 'Primary School', available: true, quality: 'good' },
        { name: 'Secondary School', available: false, quality: 'fair' },
        { name: 'Anganwadi Center', available: true, quality: 'fair' }
      ],
      healthcare: [
        { name: 'Primary Health Center', available: false, quality: 'fair' },
        { name: 'Sub Health Center', available: true, quality: 'poor' },
        { name: 'ASHA Worker', available: true, quality: 'good' }
      ],
      water: [
        { name: 'Hand Pump', available: true, quality: 'good' },
        { name: 'Piped Water Supply', available: false, quality: 'fair' },
        { name: 'Water Tank', available: false, quality: 'fair' }
      ],
      sanitation: [
        { name: 'Individual Toilets', available: true, quality: 'fair' },
        { name: 'Community Toilets', available: false, quality: 'fair' },
        { name: 'Waste Management', available: false, quality: 'poor' }
      ],
      electricity: [
        { name: 'Electricity Connection', available: true, quality: 'fair' },
        { name: 'Street Lights', available: false, quality: 'fair' },
        { name: 'Solar Power', available: false, quality: 'fair' }
      ],
      roads: [
        { name: 'Paved Roads', available: true, quality: 'good' },
        { name: 'Internal Roads', available: false, quality: 'poor' },
        { name: 'Bus Connectivity', available: true, quality: 'fair' }
      ],
      connectivity: [
        { name: 'Mobile Network', available: true, quality: 'good' },
        { name: 'Internet Connectivity', available: false, quality: 'fair' },
        { name: 'Post Office', available: true, quality: 'fair' }
      ],
      banking: [
        { name: 'Bank Branch', available: false, quality: 'fair' },
        { name: 'ATM', available: false, quality: 'fair' },
        { name: 'Banking Correspondent', available: true, quality: 'good' }
      ],
      market: [
        { name: 'Weekly Market', available: true, quality: 'good' },
        { name: 'Fair Price Shop', available: true, quality: 'fair' },
        { name: 'Cooperative Store', available: false, quality: 'fair' }
      ]
    },
    adarshGramStatus: 'not-started'
  },
  {
    name: 'Khandwa',
    district: 'East Nimar',
    state: 'Madhya Pradesh',
    pincode: '450001',
    coordinates: { latitude: 21.8247, longitude: 76.3529 },
    population: { total: 3200, scPopulation: 2240, scPercentage: 70 },
    amenities: {
      education: [
        { name: 'Primary School', available: true, quality: 'excellent' },
        { name: 'Secondary School', available: true, quality: 'good' },
        { name: 'Anganwadi Center', available: true, quality: 'excellent' }
      ],
      healthcare: [
        { name: 'Primary Health Center', available: true, quality: 'good' },
        { name: 'Sub Health Center', available: true, quality: 'good' },
        { name: 'ASHA Worker', available: true, quality: 'excellent' }
      ],
      water: [
        { name: 'Hand Pump', available: true, quality: 'excellent' },
        { name: 'Piped Water Supply', available: true, quality: 'good' },
        { name: 'Water Tank', available: true, quality: 'good' }
      ],
      sanitation: [
        { name: 'Individual Toilets', available: true, quality: 'excellent' },
        { name: 'Community Toilets', available: true, quality: 'good' },
        { name: 'Waste Management', available: true, quality: 'good' }
      ],
      electricity: [
        { name: 'Electricity Connection', available: true, quality: 'excellent' },
        { name: 'Street Lights', available: true, quality: 'good' },
        { name: 'Solar Power', available: true, quality: 'good' }
      ],
      roads: [
        { name: 'Paved Roads', available: true, quality: 'excellent' },
        { name: 'Internal Roads', available: true, quality: 'good' },
        { name: 'Bus Connectivity', available: true, quality: 'excellent' }
      ],
      connectivity: [
        { name: 'Mobile Network', available: true, quality: 'excellent' },
        { name: 'Internet Connectivity', available: true, quality: 'good' },
        { name: 'Post Office', available: true, quality: 'excellent' }
      ],
      banking: [
        { name: 'Bank Branch', available: true, quality: 'good' },
        { name: 'ATM', available: true, quality: 'good' },
        { name: 'Banking Correspondent', available: true, quality: 'excellent' }
      ],
      market: [
        { name: 'Weekly Market', available: true, quality: 'excellent' },
        { name: 'Fair Price Shop', available: true, quality: 'excellent' },
        { name: 'Cooperative Store', available: true, quality: 'good' }
      ]
    },
    adarshGramStatus: 'declared'
  },
  {
    name: 'Bhimavaram',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    pincode: '534201',
    coordinates: { latitude: 16.5408, longitude: 81.5232 },
    population: { total: 1800, scPopulation: 1080, scPercentage: 60 },
    amenities: {
      education: [
        { name: 'Primary School', available: true, quality: 'fair' },
        { name: 'Secondary School', available: false, quality: 'fair' },
        { name: 'Anganwadi Center', available: true, quality: 'good' }
      ],
      healthcare: [
        { name: 'Primary Health Center', available: false, quality: 'fair' },
        { name: 'Sub Health Center', available: true, quality: 'poor' },
        { name: 'ASHA Worker', available: true, quality: 'fair' }
      ],
      water: [
        { name: 'Hand Pump', available: true, quality: 'fair' },
        { name: 'Piped Water Supply', available: false, quality: 'fair' },
        { name: 'Water Tank', available: false, quality: 'fair' }
      ],
      sanitation: [
        { name: 'Individual Toilets', available: false, quality: 'poor' },
        { name: 'Community Toilets', available: false, quality: 'poor' },
        { name: 'Waste Management', available: false, quality: 'poor' }
      ],
      electricity: [
        { name: 'Electricity Connection', available: true, quality: 'poor' },
        { name: 'Street Lights', available: false, quality: 'poor' },
        { name: 'Solar Power', available: false, quality: 'fair' }
      ],
      roads: [
        { name: 'Paved Roads', available: false, quality: 'poor' },
        { name: 'Internal Roads', available: false, quality: 'poor' },
        { name: 'Bus Connectivity', available: false, quality: 'poor' }
      ],
      connectivity: [
        { name: 'Mobile Network', available: true, quality: 'fair' },
        { name: 'Internet Connectivity', available: false, quality: 'poor' },
        { name: 'Post Office', available: false, quality: 'fair' }
      ],
      banking: [
        { name: 'Bank Branch', available: false, quality: 'fair' },
        { name: 'ATM', available: false, quality: 'fair' },
        { name: 'Banking Correspondent', available: false, quality: 'fair' }
      ],
      market: [
        { name: 'Weekly Market', available: false, quality: 'fair' },
        { name: 'Fair Price Shop', available: true, quality: 'poor' },
        { name: 'Cooperative Store', available: false, quality: 'fair' }
      ]
    },
    adarshGramStatus: 'not-started'
  },
  {
    name: 'Koraput',
    district: 'Koraput',
    state: 'Odisha',
    pincode: '764020',
    coordinates: { latitude: 18.8120, longitude: 82.7108 },
    population: { total: 4200, scPopulation: 3360, scPercentage: 80 },
    amenities: {
      education: [
        { name: 'Primary School', available: true, quality: 'good' },
        { name: 'Secondary School', available: true, quality: 'fair' },
        { name: 'Anganwadi Center', available: true, quality: 'good' }
      ],
      healthcare: [
        { name: 'Primary Health Center', available: true, quality: 'fair' },
        { name: 'Sub Health Center', available: true, quality: 'good' },
        { name: 'ASHA Worker', available: true, quality: 'good' }
      ],
      water: [
        { name: 'Hand Pump', available: true, quality: 'good' },
        { name: 'Piped Water Supply', available: true, quality: 'fair' },
        { name: 'Water Tank', available: false, quality: 'fair' }
      ],
      sanitation: [
        { name: 'Individual Toilets', available: true, quality: 'good' },
        { name: 'Community Toilets', available: true, quality: 'fair' },
        { name: 'Waste Management', available: false, quality: 'fair' }
      ],
      electricity: [
        { name: 'Electricity Connection', available: true, quality: 'good' },
        { name: 'Street Lights', available: true, quality: 'fair' },
        { name: 'Solar Power', available: false, quality: 'fair' }
      ],
      roads: [
        { name: 'Paved Roads', available: true, quality: 'good' },
        { name: 'Internal Roads', available: true, quality: 'fair' },
        { name: 'Bus Connectivity', available: true, quality: 'good' }
      ],
      connectivity: [
        { name: 'Mobile Network', available: true, quality: 'good' },
        { name: 'Internet Connectivity', available: true, quality: 'fair' },
        { name: 'Post Office', available: true, quality: 'good' }
      ],
      banking: [
        { name: 'Bank Branch', available: true, quality: 'fair' },
        { name: 'ATM', available: true, quality: 'fair' },
        { name: 'Banking Correspondent', available: true, quality: 'good' }
      ],
      market: [
        { name: 'Weekly Market', available: true, quality: 'good' },
        { name: 'Fair Price Shop', available: true, quality: 'good' },
        { name: 'Cooperative Store', available: true, quality: 'fair' }
      ]
    },
    adarshGramStatus: 'in-progress'
  },
  {
    name: 'Dindigul',
    district: 'Dindigul',
    state: 'Tamil Nadu',
    pincode: '624001',
    coordinates: { latitude: 10.3673, longitude: 77.9803 },
    population: { total: 2800, scPopulation: 1960, scPercentage: 70 },
    amenities: {
      education: [
        { name: 'Primary School', available: true, quality: 'excellent' },
        { name: 'Secondary School', available: true, quality: 'good' },
        { name: 'Anganwadi Center', available: true, quality: 'excellent' }
      ],
      healthcare: [
        { name: 'Primary Health Center', available: true, quality: 'excellent' },
        { name: 'Sub Health Center', available: true, quality: 'good' },
        { name: 'ASHA Worker', available: true, quality: 'excellent' }
      ],
      water: [
        { name: 'Hand Pump', available: true, quality: 'excellent' },
        { name: 'Piped Water Supply', available: true, quality: 'excellent' },
        { name: 'Water Tank', available: true, quality: 'good' }
      ],
      sanitation: [
        { name: 'Individual Toilets', available: true, quality: 'excellent' },
        { name: 'Community Toilets', available: true, quality: 'excellent' },
        { name: 'Waste Management', available: true, quality: 'excellent' }
      ],
      electricity: [
        { name: 'Electricity Connection', available: true, quality: 'excellent' },
        { name: 'Street Lights', available: true, quality: 'excellent' },
        { name: 'Solar Power', available: true, quality: 'good' }
      ],
      roads: [
        { name: 'Paved Roads', available: true, quality: 'excellent' },
        { name: 'Internal Roads', available: true, quality: 'excellent' },
        { name: 'Bus Connectivity', available: true, quality: 'excellent' }
      ],
      connectivity: [
        { name: 'Mobile Network', available: true, quality: 'excellent' },
        { name: 'Internet Connectivity', available: true, quality: 'excellent' },
        { name: 'Post Office', available: true, quality: 'excellent' }
      ],
      banking: [
        { name: 'Bank Branch', available: true, quality: 'excellent' },
        { name: 'ATM', available: true, quality: 'excellent' },
        { name: 'Banking Correspondent', available: true, quality: 'excellent' }
      ],
      market: [
        { name: 'Weekly Market', available: true, quality: 'excellent' },
        { name: 'Fair Price Shop', available: true, quality: 'excellent' },
        { name: 'Cooperative Store', available: true, quality: 'excellent' }
      ]
    },
    adarshGramStatus: 'declared'
  }
];

async function seedVillages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adarsh-gram-gap-finder');
    console.log('✅ Connected to MongoDB');

    // Clear existing villages
    await Village.deleteMany({});
    console.log('🗑️  Cleared existing villages');

    // Insert mock villages
    const villages = await Village.insertMany(mockVillages);
    console.log(`🌾 Successfully seeded ${villages.length} villages`);

    // Display summary
    const summary = await Village.aggregate([
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 },
          avgGapScore: { $avg: '$gapScore' }
        }
      }
    ]);

    console.log('\n📊 Seeding Summary:');
    summary.forEach(state => {
      console.log(`   ${state._id}: ${state.count} villages (Avg Gap Score: ${state.avgGapScore.toFixed(1)})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding villages:', error);
    process.exit(1);
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedVillages();
}

module.exports = seedVillages;




