const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Add Subject (Admin only)
router.post('/add', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, code } = req.body;

    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject already exists' });
    }

    const subject = new Subject({ name, code });
    await subject.save();

    res.status(201).json({ message: 'Subject added successfully', subject });

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get All Subjects
router.get('/all', auth, async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Student Select Subjects
router.post('/select', auth, async (req, res) => {
  try {
    const { subjectIds } = req.body;

    await User.findByIdAndUpdate(req.user.userId, {
      subjects: subjectIds
    });

    for (const subjectId of subjectIds) {
      await Subject.findByIdAndUpdate(subjectId, {
        $addToSet: { students: req.user.userId }
      });
    }

    res.status(200).json({ message: 'Subjects selected successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;