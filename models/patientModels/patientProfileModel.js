const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: ObjectId,
      ref: "PatientAuth",
      required: true,
    },
    profilePicture: {
      public_id: {
        type: String,
      },

      url: {
        type: String,
      },
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    // date of birth , address required rhega ya nhi ye requirement ke according change krenge
    address: {
      street: {
        type: String,
        //   required: true,
      },
      city: {
        type: String,
        //   required: true,
      },
      state: {
        type: String,
        //   required: true,
      },
      zipCode: {
        type: String,
        //   required: true,
      },
    },
    medicalHistory: [
      {
        type: String,
      },
    ],
    appointmentIds: [
      {
        type: ObjectId,
        ref: "Appointment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientProfile", PatientSchema);
