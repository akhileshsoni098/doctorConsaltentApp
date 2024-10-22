const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const timeSlotSchema = new mongoose.Schema({
  docterId: {
    type: ObjectId,
    required: true,
  },
  day: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
});

module.exports = mongoose.model("timeSlot", timeSlotSchema);
