// http/server.js
const http = require("http");
const app = require("../app/app");

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`HTTP server is running on port ${PORT}.`);
});

module.exports = httpServer;