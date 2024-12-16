const mongoose = require("mongoose");

// Define the WinningNumber schema
const winningNumberSchema = new mongoose.Schema(
  {
    // The name of the lottery category for which the winning numbers were drawn
    lotteryCategoryName: {
      type: String,
      required: true,
    },
    // The date when the winning numbers were drawn
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    // The winning numbers for each game category
    numbers: {
      type: [
        {
          // The name of the game category
          gameCategory: {
            type: String,
          },
          number: {
            type: String
          },
          position: {
            type: Number
          }
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Create the WinningNumber model
const WinningNumber = mongoose.model("WinningNumber", winningNumberSchema);

// Export the WinningNumber model
module.exports = WinningNumber;
