const { authJwt, verifySignUp } = require("../../middlewares");
const controller = require("../../controllers/admin/subAdmin.controller");
const upload = require("../../config/upload.config");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Add Sub Admin
  app.post(
    "/api/admin/addsubadmin",
    [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateuserName],
    upload.single("companyLogo"),
    controller.addSubadmin
  );

  // Read Sub Admin
  app.get(
    "/api/admin/getsubadmin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSubadmin
  );

  // Update Sub Admin
  app.patch(
    "/api/admin/updatesubadmin/:id",
    [authJwt.verifyToken, verifySignUp.checkDuplicateuserName, authJwt.isAdmin],
    upload.single("companyLogo"),
    controller.updateSubadmin
  );

  // Delete Sub Admin
  app.delete(
    "/api/admin/deletesubadmin/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteSubadmin
  );
};