const { authJwt, lotteryCategory } = require("../../middlewares");
const controller = require("../../controllers/admin/lotteryCategory.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Create
  app.post(
    "/api/admin/addlotterycategory",
    [authJwt.verifyToken, lotteryCategory.checkDuplicateName, authJwt.isAdmin],
    controller.addLotteryCategory
  );

  // Read
  app.get(
    "/api/admin/getlotterycategory",
    [authJwt.verifyToken],
    controller.readLotteryCategory
  );

  // Update
  app.patch(
    "/api/admin/updatelotterycategory/:id",
    [authJwt.verifyToken, lotteryCategory.checkDuplicateName, authJwt.isAdmin],
    controller.updateLotteryCategory
  );

  // Delete
  app.delete(
    "/api/admin/deletelotterycategory/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteLotteryCategory
  );
};