const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const patientAuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "Patient",
    },

    fcmToken: {
      type: String,
    },

    patientProfileData: {
      type: ObjectId,
      ref: "PatientProfile",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientAuth", patientAuthSchema);
