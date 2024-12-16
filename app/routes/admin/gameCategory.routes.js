const { authJwt, gameCategory } = require("../../middlewares");
const controller = require("../../controllers/admin/gameCategory.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Create
  app.post(
    "/api/admin/addgamecategory",
    [authJwt.verifyToken, gameCategory.checkDuplicateName, authJwt.isAdmin],
    controller.addGameCategory
  );

  // Read
  app.get(
    "/api/admin/getgamecategory",
    [authJwt.verifyToken],
    controller.readGameCategory
  );

  // Update
  app.patch(
    "/api/admin/updategamecategory/:id",
    [authJwt.verifyToken, gameCategory.checkDuplicateName, authJwt.isAdmin, gameCategory.getGameCategory,],
    controller.updateGameCategory
  );

  // Delete
  app.delete(
    "/api/admin/deletegamecategory/:id",
    [authJwt.verifyToken, authJwt.isAdmin, gameCategory.getGameCategory],
    controller.deleteGameCategory
  );
};