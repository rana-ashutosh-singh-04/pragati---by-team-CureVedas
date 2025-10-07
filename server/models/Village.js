const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  available: { type: Boolean, default: false },
  quality: { type: String, enum: ['excellent', 'good', 'fair', 'poor'], default: 'fair' },
  distance: { type: Number, default: 0 }, // Distance in km
  notes: { type: String, default: '' }
});

const villageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  population: {
    total: { type: Number, required: true },
    scPopulation: { type: Number, required: true },
    scPercentage: { type: Number, required: true }
  },
  amenities: {
    education: [amenitySchema],
    healthcare: [amenitySchema],
    water: [amenitySchema],
    sanitation: [amenitySchema],
    electricity: [amenitySchema],
    roads: [amenitySchema],
    connectivity: [amenitySchema],
    banking: [amenitySchema],
    market: [amenitySchema]
  },
  gapScore: { type: Number, default: 0 },
  priorityRank: { type: Number, default: 0 },
  adarshGramStatus: { 
    type: String, 
    enum: ['declared', 'in-progress', 'not-started'], 
    default: 'not-started' 
  },
  lastUpdated: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'system' }
}, {
  timestamps: true
});

// Calculate gap score before saving
villageSchema.pre('save', function(next) {
  this.calculateGapScore();
  next();
});

// Method to calculate gap score
villageSchema.methods.calculateGapScore = function() {
  let totalGaps = 0;
  let totalCategories = 0;
  
  const categoryWeights = {
    education: 0.15,
    healthcare: 0.20,
    water: 0.15,
    sanitation: 0.10,
    electricity: 0.10,
    roads: 0.10,
    connectivity: 0.10,
    banking: 0.05,
    market: 0.05
  };
  
  Object.keys(this.amenities).forEach(category => {
    const categoryAmenities = this.amenities[category];
    if (categoryAmenities && categoryAmenities.length > 0) {
      const availableCount = categoryAmenities.filter(amenity => amenity.available).length;
      const totalCount = categoryAmenities.length;
      const gapPercentage = (totalCount - availableCount) / totalCount;
      
      totalGaps += gapPercentage * categoryWeights[category];
      totalCategories += categoryWeights[category];
    }
  });
  
  // Gap score is percentage of missing amenities (0-100, higher = more gaps)
  this.gapScore = totalCategories > 0 ? Math.round((totalGaps / totalCategories) * 100) : 100;
};

// Method to get priority rank based on gap score and SC population
villageSchema.methods.calculatePriorityRank = function() {
  // Higher gap score and higher SC percentage = higher priority
  const scWeight = this.population.scPercentage / 100;
  const gapWeight = this.gapScore / 100;
  
  // Priority score (0-100, higher = more priority)
  const priorityScore = (scWeight * 0.4) + (gapWeight * 0.6);
  this.priorityRank = Math.round(priorityScore * 100);
  
  return this.priorityRank;
};

module.exports = mongoose.model('Village', villageSchema);




