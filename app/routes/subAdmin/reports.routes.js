const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/reports.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

   // ticket sale reports 
   app.get(
    "/api/subadmin/getsalereports",
    [authJwt.verifyToken],
    controller.getSaleReports
  );

  app.get("/api/sbuadmin/getselldetails", [authJwt.verifyToken], controller.getSellDetails);
  app.get("/api/sbuadmin/getselldetailsbygamecategory", [authJwt.verifyToken], controller.getSellDetailsByGameCategory);
  app.get("/api/sbuadmin/getselldetailsallloterycategory", [authJwt.verifyToken], controller.getSellDetailsByAllLoteryCategory);
  app.get("/api/sbuadmin/getsellgamenumberinfo", [authJwt.verifyToken], controller.getSellGameNumberInfo);
};