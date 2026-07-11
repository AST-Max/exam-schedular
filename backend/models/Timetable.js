const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  generatedAt: {
    type: Date,
    default: Date.now
  },
  slots: [{
    timeSlot: {
      type: Number,
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    subjectName: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('Timetable', timetableSchema);