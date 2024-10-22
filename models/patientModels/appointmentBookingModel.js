const mongoose = require('mongoose');

const AppointmentookingSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  timeSlot: {
    day: {
        type: String,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
  },
  // docter can confirm this but if need to allow patient  or dr. and Patient to mark completed or cancelled then can handle this too (requirements)
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  symptoms: { 
    type: String, 
    default: ""  
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  /// ye link docter genrate krke de sktey ye conditional ho skta h 
  videoCallLink:{ 
    type: String  
  }
},{timestamps: true});

module.exports = mongoose.model('Appointment', AppointmentookingSchema);

////haan message bhi ho skta h aur file sharing bhi Prescription ke liye oo bhi handle krna pd skta h but requirement kya h uske accoding dekh lenge //////





