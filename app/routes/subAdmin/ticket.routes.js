const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/ticket.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Read all
  app.get(
    "/api/subadmin/gettickets",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getTicket
  );

  // winner ticket get
  app.get(
    "/api/subadmin/getwintickets",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.matchWinningNumbers
  );

  // Delete
  app.delete(
    "/api/subadmin/deleteticket/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deleteTicket
  );

   // Read all
   app.get(
    "/api/subadmin/getdeletedtickets",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getDeletedTicket
  );


  // Delete
  app.delete(
    "/api/subadmin/deleteticketforever/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deleteTicketForever
  );

};