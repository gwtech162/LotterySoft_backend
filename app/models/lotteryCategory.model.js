const mongoose = require("mongoose");

/**
 * In this simplified schema, we've only included the following fields:
 * 
    lotteryName: A required string field that is unique.
    startTime: A required Date field that represents the start time of the lottery category.
    endTime: A required Date field that represents the end time of the lottery category.
    timestamps: An option that adds createdAt and updatedAt fields to the schema.

    This schema can be used to create and manipulate Lottery Category documents with basic information such as name, start time, and end time in your Mongoose application.
*/

const lotteryCategorySchema = new mongoose.Schema(
  {
    lotteryName: {
      type: String,
      required: true,
    },
    startTime: String,
    endTime: String,
  },
  {
    timestamps: true,
  }
);

const LotteryCategory = mongoose.model(
  "LotteryCategory",
  lotteryCategorySchema
);

module.exports = LotteryCategory;
