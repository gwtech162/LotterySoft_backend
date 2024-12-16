const mongoose = require("mongoose");

// Define the Limits schema
const limitsSchema = new mongoose.Schema(
  {
    // The subAdmin who limit the number
    subAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    superVisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // The name of the LotteryCategory associated with these limits
    lotteryCategoryName: {
      type: String,
      required: true,
    },
    limits: {
      type: [
        {
          // The name of the game category associated with these limits
          gameCategory: {
            type: String,
          },
          // The limits for this game category
          limitPercent: {
            type: Number
          }
        }
      ]
    },
  },
  // Add timestamps to the schema
  {
    timestamps: true,
  }
);

// Create the Limits model
const Limits = mongoose.model("PercentageLimits", limitsSchema);

// Export the Limits model
module.exports = Limits;