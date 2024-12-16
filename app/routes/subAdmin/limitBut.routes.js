const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/limitBut.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Add Sub Admin
  app.post(
    "/api/subadmin/addlimitbut",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.addLimitBut
  );

  // Read Sub Admin
  app.get(
    "/api/subadmin/getlimitbut",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getLimitBut
  );

  // Read Seller
  app.get(
    "/api/subadmin/getlimitbutSeller",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getLimitButSeller
  );

  // Read supervisor
  app.get(
    "/api/subadmin/getlimitbutSuperVisor",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getLimitButSuperVisor
  );

  // Read Sub Admin
  app.get(
    "/api/subadmin/getlimitbutAll",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getLimitButAll
  );

  // Update Sub Admin
  app.patch(
    "/api/subadmin/updatelimitbut/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.updateLimitBut
  );

  // Delete Sub Admin
  app.delete(
    "/api/subadmin/deletelimitbut/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deleteLimitBut
  );
};
