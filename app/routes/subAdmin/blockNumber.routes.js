const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/blockNumber.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Add Sub Admin
  app.post(
    "/api/subadmin/addblocknumber",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.addBlockNumber
  );

  // Read Sub Admin
  app.get(
    "/api/subadmin/getblocknumber",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.getBlockNumber
  );

  // Update Sub Admin
  app.patch(
    "/api/subadmin/updateblocknumber/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.updateBlockNumber
  );

  // Delete Sub Admin
  app.delete(
    "/api/subadmin/deleteblocknumber/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deleteBlockNumber
  );
};