const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

// Create an index on email field for faster lookups
studentSchema.index({ email: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
