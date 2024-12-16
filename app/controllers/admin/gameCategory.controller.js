const db = require("../../models");
const GameCategory = db.gameCategory;

// Create
exports.addGameCategory = async (req, res) => {
  try {
    const gameCategory = new GameCategory(req.body);
    await gameCategory.save();
    res.status(201).send(gameCategory);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// Read
exports.readGameCategory = async (req, res) => {
  try {
    const gameCategories = await GameCategory.find();
    res.send(gameCategories);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update
exports.updateGameCategory = async (req, res) => {
  try {
    const { gameName, requiredLength } = req.body;
    if (gameName) {
      res.gameCategory.gameName = gameName;
    }
    if (requiredLength) {
      res.gameCategory.requiredLength = requiredLength;
    }
    await res.gameCategory.save();
    res.send(res.gameCategory);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// Delete
exports.deleteGameCategory = async (req, res) => {
  try {
    await res.gameCategory.remove();
    res.send({ message: "Game category deleted" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};