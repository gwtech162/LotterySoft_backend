const db = require("../../models");
const PaymentTerm = db.paymentTerm;

// Create
exports.addPaymentTerm = async (req, res) => {
  try {
    const { lotteryCategoryName, conditions } = req.body;
    subAdmin = req.userId;

    const paymentTermsCheck = await PaymentTerm.find({
      subAdmin: subAdmin,
      lotteryCategoryName: lotteryCategoryName
    });

    if(paymentTermsCheck.length != 0) {
      res.status(400).send({message: "Already exist by LotteryCategoryName! You have to update"});
      return;
    }

    const paymentTerm = new PaymentTerm({
      subAdmin: subAdmin,
      lotteryCategoryName: lotteryCategoryName,
      conditions: conditions
    });
   
    await paymentTerm.save();
    res.send(paymentTerm);
  } catch (error) {
    res.status(400).send(error);
  }
};


// Read
exports.readPaymentTermBySubAdminId = async (req, res) => {
  try {
    const paymentTerms = await PaymentTerm.find({
      subAdmin: req.userId,
    });
    res.send(paymentTerms);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update
exports.updatePaymentTerm = async (req, res) => {
  try {
    const paymentTerm = await PaymentTerm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send(paymentTerm);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete
exports.deletePaymentTerm = async (req, res) => {
  try {
    const paymentTerm = await PaymentTerm.findByIdAndDelete(req.params.id);
    res.send(paymentTerm);
  } catch (error) {
    res.status(500).send(error);
  }
};
