const { authJwt, verifySignUp } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/seller.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Add Sub Admin
  app.post(
    "/api/subadmin/addseller",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.addseller
  );

  // Read Sub Admin
  app.get(
    "/api/subadmin/getseller",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getseller
  );

  // Update Sub Admin
  app.patch(
    "/api/subadmin/updateseller/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.updateseller
  );

  // Update Sub Admin
  app.patch(
    "/api/subadmin/updateBonusFlag",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.updateBonusFlag
  );

  // Delete Sub Admin
  app.delete(
    "/api/subadmin/deleteseller/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deleteseller
  );
};