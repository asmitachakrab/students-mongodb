require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Initialize dotenv for environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error: ', err));

// Define Student and Course Schemas
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  courseName: { type: String, index: true },
  instructor: String,
  credits: Number
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  assignedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  createdAt: { type: Date, default: Date.now }
});

// User Schema (example)
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: String, // student, teacher, admin, etc.
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Define Models
const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);

// Root Route
app.get('/', (req, res) => {
  res.send('Student Management System API is working!');
});

// CREATE a Student
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, age, enrolledCourses } = req.body;
    const newStudent = new Student({ name, email, age, enrolledCourses });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CREATE a Course
app.post('/api/courses', async (req, res) => {
  try {
    const { courseName, instructor, credits } = req.body;
    const newCourse = new Course({ courseName, instructor, credits });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CREATE a Task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, assignedCourse, student } = req.body;
    const newTask = new Task({ title, description, dueDate, assignedCourse, student });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CREATE a User
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    const newUser = new User({ username, password, role, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ all Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ all Courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Students with Enrolled Courses (Using $lookup)
app.get('/api/students/courses', async (req, res) => {
  try {
    const students = await Student.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'enrolledCourses',
          foreignField: '_id',
          as: 'courseDetails'
        }
      }
    ]);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a Student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, email, age, enrolledCourses } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
      name,
      email,
      age,
      enrolledCourses
    }, { new: true });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a Student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a Course
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a Task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a User
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
