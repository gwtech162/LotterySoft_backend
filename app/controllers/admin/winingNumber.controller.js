const db = require("../../models");
const WinningNumber = db.winningNumber;

// Create
exports.addWinningNumber = async (req, res) => {
  try {
    const winningNumber = new WinningNumber(req.body);
    await winningNumber.save();

    res.send(winningNumber);

  } catch (error) {
    res.status(400).send(error);
  }
};

// Read
exports.readWinningNumber = async (req, res) => {
  try {
    const { lotteryCategoryName, fromDate, toDate } = req.body;
    let winningNumber = null;
    if( lotteryCategoryName == "" ) {
      winningNumber = await WinningNumber.find({
        date: {$gte: fromDate, $lte: toDate}
      });
    } else {
      winningNumber = await WinningNumber.find({
        lotteryCategoryName: lotteryCategoryName,
        date: {$gte: fromDate, $lte: toDate}
      });
    }
    if (winningNumber.length == 0) {
      return res.send({ success: false, message: "Winning number not found" });
    }
    res.send({ success: true, data: winningNumber});
  } catch (err) {
    console.log(err.message);
    res.send({ success: false, message: "Server error" });
  }
};

// Read
exports.readWinningNumberByDate = async (req, res) => {
  try {
    const winningNumber = await WinningNumber.findOne({
      date: req.params.date,
    }).populate("lotteryCategory");
    if (!winningNumber) {
      return res.status(404).json({ message: "Winning number not found" });
    }
    res.json(winningNumber);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update
exports.updateWinningNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const winningNumber = await WinningNumber.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    if (!winningNumber) {
      return res.status(404).send();
    }
    res.send(winningNumber);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete
exports.deleteWinningNumber = async (req, res) => {
  try {
    const winningNumber = await WinningNumber.findOneAndDelete({
      _id: req.params.id,
    }).populate("lotteryCategory");
    if (!winningNumber) {
      return res.status(404).json({ message: "Winning number not found" });
    }
    res.json({ message: "Winning number deleted successfully!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
