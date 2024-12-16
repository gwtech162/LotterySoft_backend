const db = require("../../models");
const WinningNumber = db.winningNumber;
// Read
exports.readWinningNumber = async (req, res) => {
  try {
    const { lotteryCategoryName, fromDate, toDate } = req.body;
    let winningNumber = null;
    if (lotteryCategoryName == "") {
      winningNumber = await WinningNumber.find({
        date: { $gte: fromDate, $lte: toDate },
      }).sort({date: 1});
    } else {
      winningNumber = await WinningNumber.find({
        lotteryCategoryName: lotteryCategoryName,
        date: { $gte: fromDate, $lte: toDate },
      }).sort({date: 1});
    }

    if (winningNumber.length == 0) {
      return res.send({ success: false, message: "Winning number not found" });
    }

    const winNumber = [];
    winningNumber.map(item => {
      let numbers = {};
      item.numbers.map( value => {
        if(value.gameCategory === "BLT" && value.position === 2) {
          numbers.second = value.number
        }
        if(value.gameCategory === "BLT" && value.position === 3) {
          numbers.third = value.number
        }
        if(value.gameCategory === "L3C") {
          numbers.l3c = value.number
        }
      })

      winNumber.push({date: item.date, lotteryName: item.lotteryCategoryName, numbers: numbers})

    })

    res.send({ success: true, data: winNumber });
  } catch (err) {
    console.log(err.message);
    res.send({ success: false, message: "Server error" });
  }
};
