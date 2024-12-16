const db = require("../models");
const GameCategory = db.gameCategory;


// Middleware to check for duplicate game names
checkDuplicateName = async (req, res, next) => {
  const { gameName } = req.body;
  const existingGame = await GameCategory.findOne({ gameName });
  if (existingGame && req._id && existingGame._id != req._id) {
    return res.status(400).json({ message: 'Game name already exists' });
  }
  next();
};

// Middleware to get a game category by ID
getGameCategory = async (req, res, next) => {
  let gameCategory;
  try {
    gameCategory = await GameCategory.findById(req.params.id);
    if (gameCategory == null) {
      return res.status(404).json({ message: 'Game category not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.gameCategory = gameCategory;
  next();
};

const gameCategory = {
  checkDuplicateName,
  getGameCategory
};

module.exports = gameCategory;
