const db = require("../../models");
const LotteryCategory = db.lotteryCategory;

// Create
exports.addLotteryCategory = async (req, res) => {
  try {
    const newCategory = new LotteryCategory(req.body);
    const category = await newCategory.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Read
exports.readLotteryCategory = async (req, res) => {
  try {
    const category = await LotteryCategory.find();
    if (!category) {
      return res.send({ success: false, message: "Category not found" });
    }
    res.send({success: true, data: category});
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update
exports.updateLotteryCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await LotteryCategory.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }
    res.send(category);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete
exports.deleteLotteryCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await LotteryCategory.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }
    res.send({ message: "Category deleted" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
