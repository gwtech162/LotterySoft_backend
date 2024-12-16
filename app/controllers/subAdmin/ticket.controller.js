const mongoose = require("mongoose");
const db = require("../../models");
const moment = require("moment-timezone");
const Ticket = db.ticket;
const User = db.user;
const Lottery = db.lotteryCategory;
const Limits = db.limits;
const LimitCalc = db.limitCalc;

// Set the timezone to Haiti
const haitiTimezone = "America/Port-au-Prince";

// Read
exports.getTicket = async (req, res) => {
  try {
    const { fromDate, toDate, lotteryCategoryName, seller } = req.query;
    const query = { isDelete: false };
    query.date = { $gte: fromDate, $lte: toDate };

    if (seller == "") {
      const sellers = await User.find({ subAdminId: req.userId }, { _id: 1 });
      let sellerIds = [];
      sellers.map((item) => {
        sellerIds.push(item._id);
      });
      query.seller = { $in: sellerIds };
    } else {
      query.seller = mongoose.Types.ObjectId(seller);
    }

    if (lotteryCategoryName != "") {
      query.lotteryCategoryName = lotteryCategoryName;
    }
    const ticketsObj = await Ticket.find(query).sort({
      lotteryCategoryName: 1,
      date: 1,
    });
    res.send({ success: true, data: ticketsObj });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//get Win Ticket
exports.matchWinningNumbers = async (req, res) => {
  try {
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const lotteryCategoryName = req.query.lotteryCategoryName;
    const seller = req.query.seller;
    const subAdminId = mongoose.Types.ObjectId(req.userId);

    const query = [];
    query.push({ $eq: ["$lotteryCategoryName", "$$lotteryCategoryName"] });
    query.push({ $eq: ["$date", "$$date"] });

    if (lotteryCategoryName != "") {
      query.push({ $eq: ["$lotteryCategoryName", lotteryCategoryName] });
    }

    let seller_query = null;
    let sellerIds = [];
    if (seller == "") {
      const sellers = await User.find({ subAdminId: subAdminId }, { _id: 1 });
      sellers.map((item) => {
        sellerIds.push(item._id);
      });

      seller_query = { $in: sellerIds };
    } else {
      seller_query = mongoose.Types.ObjectId(seller);
    }

    Ticket.aggregate([
      {
        $match: {
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
          seller: seller_query,
          isDelete: false,
        },
      },
      {
        $lookup: {
          from: "winningnumbers", // The collection name for WinningNumber model
          let: {
            lotteryCategoryName: "$lotteryCategoryName",
            date: "$date",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: query,
                },
              },
            },
          ],
          as: "winningNumbers",
        },
      },
      {
        $lookup: {
          from: "paymentterms",
          let: {
            lotteryCategoryName: "$lotteryCategoryName",
            subAdmin: "$subAdmin",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$lotteryCategoryName", "$$lotteryCategoryName"] },
                    { $eq: ["$subAdmin", subAdminId] },
                  ],
                },
              },
            },
          ],
          as: "paymentTerms",
        },
      },
      {
        $project: {
          seller: 1,
          ticketId: 1,
          date: 1,
          lotteryCategoryName: 1,
          numbers: 1,
          winningNumbers: 1,
          paymentTerms: 1,
        },
      },
      {
        $sort: {
          lotteryCategoryName: 1,
          ticketId: 1,
          date: 1,
        },
      },
    ]).exec((err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "not found!" });
      } else {
        const winTicket = [];
        // Process the result
        result.forEach((item) => {
          let numbers = item.numbers;
          if (item.winningNumbers.length == 0) return false;
          let winnumbers = item.winningNumbers[0].numbers;
          let payterms = item.paymentTerms[0].conditions;
          let paidAmount = 0;

          const winGameNumber = [];
          let winTicketFlag = false;

          numbers.forEach((gameNumber) => {
            let winNumberFlag = false;
            winnumbers.forEach((winNumber) => {
              if (
                gameNumber.number === winNumber.number &&
                gameNumber.gameCategory === winNumber.gameCategory
              ) {
                winNumberFlag = true;
                payterms.forEach((term) => {
                  if (
                    term.gameCategory === winNumber.gameCategory &&
                    winNumber.position === term.position
                  ) {
                    paidAmount += gameNumber.amount * term.condition;
                  }
                });
                return;
              }
            });

            if (winNumberFlag) {
              winGameNumber.push({ ...gameNumber, winFlag: true });
              winTicketFlag = true;
            } else {
              winGameNumber.push(gameNumber);
            }
          });

          if (winTicketFlag) {
            winTicket.push({
              ticketId: item.ticketId,
              date: item.date,
              lotteryCategoryName: item.lotteryCategoryName,
              seller: item.seller,
              numbers: winGameNumber,
              paidAmount: paidAmount,
            });
          }
        });
        res.send({ success: true, data: winTicket });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Delete
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(
      mongoose.Types.ObjectId(req.params.id)
    );
    if (ticket == null) {
      return res.status(404).send({ message: "Ticket not found" });
    }

    const lotInfo = await Lottery.findOne({
      lotteryName: ticket.lotteryCategoryName,
    });

    const currentTime = moment().tz(haitiTimezone).format("HH:mm");
    const today = moment().tz(haitiTimezone).format("yyyy-MM-DD");

    const limitGameCategoryMapping = {
      "L4C 1": "L4C",
      "L4C 2": "L4C",
      "L4C 3": "L4C",
      "L5C 1": "L5C",
      "L5C 2": "L5C",
      "L5C 3": "L5C",
    };

    if (
      moment(new Date(today), "yyyy-MM-DD").isSame(
        moment(new Date(ticket.date), "YYY-MM-DD"),
        "day"
      ) &&
      moment(currentTime, "HH:mm").isAfter(
        moment(lotInfo.startTime, "HH:mm")
      ) &&
      moment(currentTime, "HH:mm").isBefore(moment(lotInfo.endTime, "HH:mm"))
    ) {
      const sellerId = ticket.seller;
      const subAdminInfo = await User.findOne({ _id: sellerId });
      const lotteryCategoryName = ticket.lotteryCategoryName;
      const numbers = ticket.numbers;
      await Promise.all(
        numbers.map(async (item) => {
          if (!item.bonus) {
            let limitGameCategory =
              limitGameCategoryMapping[item.gameCategory] || item.gameCategory;

            const pipeline = [
              {
                $match: {
                  subAdmin: subAdminInfo.subAdminId,
                  lotteryCategoryName,
                  $or: [
                    {
                      seller: mongoose.Types.ObjectId(sellerId),
                      "limits.gameCategory": limitGameCategory,
                      "limits.gameNumber": item.number,
                    },
                    {
                      "limits.gameCategory": limitGameCategory,
                      "limits.gameNumber": item.number,
                    },
                    {
                      seller: mongoose.Types.ObjectId(sellerId),
                      "limits.gameCategory": limitGameCategory,
                    },
                    {
                      "limits.gameCategory": limitGameCategory,
                    },
                  ],
                },
              },
              {
                $addFields: {
                  limits: {
                    $filter: {
                      input: "$limits",
                      cond: {
                        $or: [
                          {
                            $and: [
                              {
                                $eq: ["$$this.gameCategory", limitGameCategory],
                              },
                              {
                                $eq: ["$$this.gameNumber", item.number],
                              },
                            ],
                          },
                          {
                            $eq: ["$$this.gameCategory", limitGameCategory],
                          },
                        ],
                      },
                    },
                  },
                },
              },
              {
                $project: {
                  limits: 1,
                },
              },
            ];

            const limit = await Limits.aggregate(pipeline);

            await LimitCalc.findOneAndUpdate(
              {
                limitId: limit[0]._id,
                "soldState.gameCategory": limitGameCategory,
                "soldState.gameNumber": item.number,
              },
              {
                $inc: {
                  "soldState.$.soldQuantity": -item.amount,
                },
              },
              { new: true }
            );
          }
        })
      );
      ticket.isDelete = true;
      await ticket.save();
      return res.send({ success: true, message: "Ticket deleted" });
    } else {
      return res.send({
        success: false,
        message: "Ticket time is up! You cann't remove this ticket!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

// Read
exports.getDeletedTicket = async (req, res) => {
  try {
    const { fromDate, toDate, lotteryCategoryName, seller } = req.query;
    const query = { isDelete: true };
    query.date = { $gte: fromDate, $lte: toDate };

    if (seller == "") {
      const sellers = await User.find({ subAdminId: req.userId }, { _id: 1 });
      let sellerIds = [];
      sellers.map((item) => {
        sellerIds.push(item._id);
      });
      query.seller = { $in: sellerIds };
    } else {
      query.seller = mongoose.Types.ObjectId(seller);
    }

    if (lotteryCategoryName != "") {
      query.lotteryCategoryName = lotteryCategoryName;
    }
    const ticketsObj = await Ticket.find(query).sort({
      lotteryCategoryName: 1,
      date: 1,
    });
    res.send({ success: true, data: ticketsObj });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete
exports.deleteTicketForever = async (req, res) => {
  try {
    await Ticket.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    return res.send({ success: true, message: "Ticket deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
