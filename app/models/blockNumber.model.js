const mongoose = require("mongoose");

// Define the BlockNumber schema
const blockNumberSchema = new mongoose.Schema(
  {
    // The subAdmin who block the ticket
    subAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // The name of the LotteryCategory associated with this block number
    lotteryCategoryName: {
      type: String,
      required: true,
    },
    // The name of the game category associated with this block number
    gameCategory: {
      type: String,
    },
    // The numbers associated with this block number
    number: {
      type: String
    }
  },
  // Add timestamps to the schema
  {
    timestamps: true,
  }
);

// Create the BlockNumber model
const BlockNumber = mongoose.model("BlockNumber", blockNumberSchema);

// Export the BlockNumber model
module.exports = BlockNumber;