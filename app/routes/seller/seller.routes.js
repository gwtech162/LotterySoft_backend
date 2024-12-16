const controller = require("../../controllers/seller/seller.controller");
const { authJwt } = require("../../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/seller/signin", controller.signIn);

  app.post("/api/seller/signout", controller.signOut);

  app.post(
    "/api/seller/newticket",
    [authJwt.verifyToken, controller.isActive, authJwt.isSeller],
    controller.newTicket
  );

  // Read all
  app.get(
    "/api/seller/gettickets",
    [authJwt.verifyToken, authJwt.isSeller],
    controller.getTicket
  );

  // winner ticket get
  app.get(
    "/api/seller/getwintickets",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.matchWinningNumbers
  );

  // ticket sale reports
  app.get(
    "/api/seller/getsalereports",
    [authJwt.verifyToken, authJwt.isSeller],
    controller.getSaleReportsForSeller
  );

  // Read all
  app.post(
    "/api/seller/getwiningnumber",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.readWinningNumber
  );

  //Lottery Time Check
  app.get(
    "/api/seller/lotterytimecheck",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.lotteryTimeCheck
  );

  //Lottery Time Check
  app.get(
    "/api/seller/getticketnumbers",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.getTicketNumbers
  );

  // Delete
  app.delete(
    "/api/seller/deleteticket/:id",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.deleteTicket
  );

  // Delete
  app.delete(
    "/api/seller/deleteticketforever/:id",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.deleteTicketForever
  );

  app.get(
    "/api/seller/getdeletedtickets",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.getDeletedTicket
  );

  // replay ticket
  app.post(
    "/api/seller/replayticket",
    [authJwt.verifyToken,  authJwt.isSeller],
    controller.replayTicket
  );
};
