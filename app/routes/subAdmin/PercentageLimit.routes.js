const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/PercentageLimit.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Add Sub Admin
  app.post(
    "/api/subadmin/addPercentageLimit",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.addPercentageLimitBut
  );

  // Read Sub Admin
  app.get(
    "/api/subadmin/getPercentageLimit",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getPercentageLimitBut
  );

  // Read Seller
  app.get(
    "/api/subadmin/getPercentageLimitButSeller",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getPercentageLimitButSeller
  );

  // Read supervisor
  app.get(
    "/api/subadmin/getPercentageLimitButSuperVisor",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getPercentageLimitButSuperVisor
  );

  // Read Sub Admin
  app.get(
    "/api/subadmin/getPercentageLimitbButAll",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getPercentageLimitButAll
  );

  // Update Sub Admin
  app.patch(
    "/api/subadmin/updatePercentageLimit/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.updatePercentageLimitBut
  );

  // Delete Sub Admin
  app.delete(
    "/api/subadmin/deletePercentageLimit/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deletePercentageLimitBut
  );
};
