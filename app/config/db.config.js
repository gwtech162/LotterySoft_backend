const { join } = require("path");

require("dotenv").config({
  path: join(__dirname, "..", "..", ".env")
});


console.log("process.env.MONGODB_HOST: ", process.env.MONGODB_HOST);
console.log("process.env.MONGODB_PORT: ", process.env.MONGODB_PORT);
module.exports = {
  HOST: process.env.MONGODB_HOST || "127.0.0.1",//"localhost",
  PORT: process.env.MONGODB_PORT || 27017, // default port
  DB: "lottery_db"
};

// pwd: NSWmJcKQw2Ca1Wn9
// mongodb+srv://zaryabdaha111:NSWmJcKQw2Ca1Wn9@cluster01.3aegn.mongodb.net/

// module.exports = {
//   URI: "mongodb+srv://zaryabdaha111:NSWmJcKQw2Ca1Wn9@cluster01.3aegn.mongodb.net/lottery_db?retryWrites=true&w=majority",
// };

module.exports = {
  URI: "mongodb+srv://databaseUser:aCAQ14_asdfCV000@project.ewo1t.mongodb.net/lottery_db?retryWrites=true&w=majority&appName=project",
};
