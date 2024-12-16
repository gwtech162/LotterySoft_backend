const db = require("../../models");
const User = db.user;

const bcrypt = require("bcryptjs");

// Create //tested
exports.addsuperVisor = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userName || !req.body.password ) {
      return res.status(400).send({
        message: "Username and password are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hashedPassword,
      role: "superVisor",
      subAdminId: req.userId,
    });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Error creating supervisor.", error: err.message });
  }
};

// Read //tested
exports.getsuperVisor = async (req, res) => {
  try {
    const users = await User.find({
      subAdminId: req.userId,
      role: "superVisor",
    });
    res.send(users);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Error retrieving supervisors.", error: err.message });
  }
};

// Update
exports.updatesuperVisor = async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "Supervisor not found." });
    }

    updates.forEach((update) => {
      if (update !== "role" && req.body[update] !== undefined) {
        // Exclude role from being updated
        user[update] = req.body[update];
      }
    });

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.send(user);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send({ message: "Error updating supervisor.", error: err.message });
  }
};

// Delete
exports.deletesuperVisor = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "Supervisor not found." });
    }
    res.send({ message: "Supervisor deleted successfully.", user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Error deleting supervisor.", error: err.message });
  }
};
