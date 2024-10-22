const mongoose = require("mongoose");

const docterAuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  isVerifiedEmail: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Docter",
  },
  fcmToken: {
    type: String,
  },
  /// if docter is verified by admin then after patient ko recomand honge
  isVerifiedAccount: {
    type: Boolean,
    default: false,
  },
  docterProfileData: {
    type: ObjectId,
    ref: "DocterProfile",
  },
  createdDate:{
    type: Date,
    default: Date.now,
  }
},{timestamps:true});


module.exports = mongoose.model("DocterAuth", docterAuthSchema);