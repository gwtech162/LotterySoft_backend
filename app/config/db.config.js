const { join } = require("path");

require("dotenv").config({
  path:join(__dirname,"..","..",".env")
});



module.exports = {
  HOST: process.env.MONGODB_HOST || "127.0.0.1",//"localhost",
  PORT: process.env.MONGODB_PORT || 27017, // default port
  DB: "lottery_db"
};

// pwd: NSWmJcKQw2Ca1Wn9
// mongodb+srv://zaryabdaha111:NSWmJcKQw2Ca1Wn9@cluster01.3aegn.mongodb.net/

// module.exports = {
//  URI: "mongodb+srv://zaryabdaha111:NSWmJcKQw2Ca1Wn9@cluster01.3aegn.mongodb.net/lottery_db?retryWrites=true&w=majority",
// };