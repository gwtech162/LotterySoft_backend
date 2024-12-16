const db = require("../models");
const LotteryCategory = db.lotteryCategory;

// Middleware to check for duplicate lottery name
checkDuplicateName = async (req, res, next) => {
  const { lotteryName } = req.body;
  try {
    const existingCategory = await LotteryCategory.findOne({ lotteryName: lotteryName });
    if (existingCategory && req._id && existingCategory._id != req._id) {
      return res.status(400).send({ error: "Category name already exists" });
    }
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const lotteryCategory = {
  checkDuplicateName
};

module.exports = lotteryCategory;
