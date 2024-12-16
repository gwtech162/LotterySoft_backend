const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/subAdmin/paymentTerm.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Create
  app.post(
    "/api/subadmin/addpaymentterm",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.addPaymentTerm
  );

  // Read all
  app.get(
    "/api/subadmin/getpaymentterm",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.readPaymentTermBySubAdminId
  );

  // Update
  app.patch(
    "/api/subadmin/updatepaymentterm/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.updatePaymentTerm
  );

  // Delete
  app.delete(
    "/api/subadmin/deletepaymentterm/:id",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.deletePaymentTerm
  );
};