const { authJwt, verifySignUp } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/superVisor.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Add Sub Admin
  app.post(
    "/api/subadmin/addsuperVisor",
    [authJwt.verifyToken, authJwt.isSubAdmin, verifySignUp.checkDuplicateuserName],
    controller.addsuperVisor
  );

  // Read Sub Admin
  app.get(
    "/api/subadmin/getsuperVisor",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getsuperVisor
  );

  // Update Sub Admin
  app.patch(
    "/api/subadmin/updatesuperVisor/:id",
    [authJwt.verifyToken, verifySignUp.checkDuplicateuserName, authJwt.isSubAdmin],
    controller.updatesuperVisor
  );

  // Delete Sub Admin
  app.delete(
    "/api/subadmin/deletesuperVisor/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deletesuperVisor
  );
};