const mongoose = require("mongoose");

const paymentTermSchema = new mongoose.Schema(
  {
    // The subAdmin who payment term the ticket
    subAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // The name of the lottery category for which the payment term applies
    lotteryCategoryName: {
      type: String,
      required: true,
    },
    // An array of objects that specify the payment terms for each game category
    conditions: {
      type: [
        {
          // The name of the game category for which the payment terms apply
          gameCategory: {
            type: String,
          },
          position: {
            type: Number
          },
          condition: {
            type: Number
          }
        },
      ],
    },
  },
  {
    // Adds createdAt and updatedAt fields to the schema
    timestamps: true,
  }
);

const PaymentTerm = mongoose.model("PaymentTerm", paymentTermSchema);

module.exports = PaymentTerm;
