const mongoose = require("mongoose");

// Define the Limits schema
const specificLimitsSchema = new mongoose.Schema(
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
          gameNumber: {
            type: String,
            default: ""
          },
          // The limits for this game category
          limitsButs: {
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
const SpecificLimits = mongoose.model("SpecificLimits", specificLimitsSchema);

// Export the Limits model
module.exports = SpecificLimits;