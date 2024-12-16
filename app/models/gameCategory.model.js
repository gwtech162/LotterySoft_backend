const mongoose = require('mongoose');

// Define the schema for a game category
const gameCategorySchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true, // The name of the game category is required
  },
  positions: {
    type: Number,
    required: true
  },
  requiredLength: {
    type: Number,
    required: true // The required length of the game is required
  }
});

// Create a model for the game category schema
const gameCategory = mongoose.model('GameCategory', gameCategorySchema);

// Export the model for use in other parts of the application
module.exports = gameCategory;