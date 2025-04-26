const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  instructor: { type: String, required: true },
  credits: { type: Number, required: true }
});

// Create a text index for courseName to allow searching by course name
courseSchema.index({ courseName: 'text' });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
