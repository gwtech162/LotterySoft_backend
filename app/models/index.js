const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.lotteryCategory = require("./lotteryCategory.model");
db.gameCategory = require("./gameCategory.model");
db.winningNumber = require("./winningNumber.model");
db.blockNumber = require("./blockNumber.model");
db.limits = require("./limits.model");
db.ticket = require("./ticket.model");
db.paymentTerm =  require("./paymentTerm.model");
db.limitCalc = require("./limitsCalc.model");
db.specificLimits = require("./specificLimits.model");
db.PercentageLimit = require("./PercentageLimit.model");

module.exports = db;