const express = require('express');
const Student = require('../models/Student');
const Course = require('../models/Course');
const router = express.Router();

// POST: Add a new student
router.post('/students', async (req, res) => {
  const { name, email, age, enrolledCourses } = req.body;

  try {
    const newStudent = new Student({
      name,
      email,
      age,
      enrolledCourses,
      createdAt: new Date(),
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new course
router.post('/courses', async (req, res) => {
  const { courseName, instructor, credits } = req.body;

  try {
    const newCourse = new Course({
      courseName,
      instructor,
      credits,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get students with enrolled courses using $lookup
router.get('/students/courses', async (req, res) => {
  try {
    const students = await Student.aggregate([
      {
        $lookup: {
          from: 'courses', // Reference to 'courses' collection
          localField: 'enrolledCourses', // Field in students collection
          foreignField: '_id', // Field in courses collection
          as: 'courses' // Alias for the result
        }
      }
    ]);
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update student details
router.put('/students/:id', async (req, res) => {
  const { name, email, age, enrolledCourses } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, age, enrolledCourses },
      { new: true } // Return updated document
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a student
router.delete('/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a course
router.delete('/courses/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
