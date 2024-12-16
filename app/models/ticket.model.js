const mongoose = require("mongoose");

// Counter model for the separate counter collection
const counterSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
  },
  lotteryCategoryName: {
    type: String,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', counterSchema);

// Define the Ticket schema
const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: Number
    },
    // The seller who sold the ticket
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // The name of the lottery category for which the ticket was sold
    lotteryCategoryName: {
      type: String,
      required: true,
    },
    // The date when the ticket was sold
    date: {
      type: Date,
      required: true
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    numbers: {
      type: [
        {
          // The name of the game category
          gameCategory: {
            type: String,
          },
          // The numbers chosen by the buyer for this game category
          number: {
            type: String
          },
          //when sold the ticket, ticket price
          amount: {
            type: Number
          },
          bonus: {
            type: Boolean,
            required: true,
            default: false
          }
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.isNew) {
    return next();
  }

  const { seller, date, lotteryCategoryName } = doc;

  try {
    const counter = await Counter.findOneAndUpdate(
      { seller, date, lotteryCategoryName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    doc.ticketId = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

// Create the Ticket model
const Ticket = mongoose.model("Ticket", ticketSchema);


// Export the Ticket model
module.exports = Ticket;
