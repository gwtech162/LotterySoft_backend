const mongoose = require("mongoose");

/**
 * This is a Mongoose schema definition for a User document that includes the following fields:

  managerId: A reference to the User document that is the manager of this user. This field is optional and can be used to create a hierarchical structure of users.
  userName: A required string field that represents the username of the user.
  email: A string field that represents the email address of the user. This field is optional and has a default value of an empty string.
  password: A required string field that represents the password of the user.
  isActive: A boolean field that defaults to true and represents whether the user is active or not.
  role: A required string field that represents the role of the user. The enum option restricts the possible values of the field to "admin", "subAdmin", "superVisor", or "seller".
  The timestamps option adds createdAt and updatedAt fields to the schema that are automatically updated when a document is created or updated.

  The User model is created from the userSchema schema and exported for use in other parts of the application.

  Overall, this schema definition provides a basic structure for a user document with fields for username, email, password, role, and activity status. The managerId field can be used to create a hierarchical structure of users if needed.
 */

const userSchema = new mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: true
    },
    imei: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bonusFlag: {
      type: Boolean,
      default: false
    },
    companyName: String,
    companyLogo: String,
    address: String,
    phoneNumber: String,
    logoUrl: String,
    role: {
      type: String,
      enum: ["admin", "subAdmin", "superVisor", "seller"],
      required: true
    },
    superVisorName: {
      type: String,
      default: "None",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;