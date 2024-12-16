const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/winingNumber.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Create
  app.post(
    "/api/admin/addwiningnumber",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addWinningNumber
  );

  // Read by date
  app.get(
    "/api/admin/getwiningnumber/:date",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.readWinningNumberByDate
  );

  // Read all
  app.post(
    "/api/admin/getwiningnumber",
    [authJwt.verifyToken],
    controller.readWinningNumber
  );

  // Update
  app.patch(
    "/api/admin/updatewiningnumber/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateWinningNumber
  );

  // Delete
  app.delete(
    "/api/admin/deletewiningnumber/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteWinningNumber
  );
};