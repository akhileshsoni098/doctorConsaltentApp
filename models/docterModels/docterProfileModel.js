const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const doctorProfileSchema = new mongoose.Schema({
  
  docterId: {
    type: ObjectId,
    ref: "DocterAuth",
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: [
    {
      degree: String,
      institution: String,
      year: Number,
    },
  ],
  experienceYears: {
    type: Number,
    required: true,
  },
  availability: [
    {
      day: String,
      startTime: String,
      endTime: String,
    },
  ],
  registrationNumber: {
    type: String,
    required: true,
  },
  hasClinic: {
    type: Boolean,
    required: true,
    default: false,
  },
  // agr clinic hoga docter ke pass toh logical part me address required hoga agr nhi toh flow maintain h
  clinicAddress: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  profilePicture: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  certificates: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      img: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    },
  ],
  //// yaha se average rating nikaal kr show kra sktey h or store kra sktey and filter bhi (based on requirements)
  reviews: [
    {
      patientId: {
        type: ObjectId,
        ref: "PaientProfile",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
    },
  ],

  appointmentIds: [
    {
      type: ObjectId,
      ref: "Appointment",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DocterProfile", doctorProfileSchema);
