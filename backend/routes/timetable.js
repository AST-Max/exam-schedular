const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const auth = require('../middleware/auth');

// Graph Coloring Algorithm
function scheduleExams(subjects) {
  const n = subjects.length;
  const graph = Array(n).fill(null).map(() => Array(n).fill(false));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const commonStudents = subjects[i].students.filter(s =>
        subjects[j].students.map(id => id.toString()).includes(s.toString())
      );
      if (commonStudents.length > 0) {
        graph[i][j] = true;
        graph[j][i] = true;
      }
    }
  }

  const colors = Array(n).fill(-1);
  colors[0] = 0;

  for (let i = 1; i < n; i++) {
    const usedColors = new Set();
    for (let j = 0; j < n; j++) {
      if (graph[i][j] && colors[j] !== -1) {
        usedColors.add(colors[j]);
      }
    }
    let color = 0;
    while (usedColors.has(color)) color++;
    colors[i] = color;
  }

  return colors;
}

// Generate Timetable (Admin only)
router.post('/generate', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const subjects = await Subject.find().populate('students');

    if (subjects.length === 0) {
      return res.status(400).json({ message: 'No subjects found' });
    }

    const colors = scheduleExams(subjects);

    const slots = subjects.map((subject, index) => ({
      timeSlot: colors[index] + 1,
      subject: subject._id,
      subjectName: subject.name
    }));

    const timetable = new Timetable({ slots });
    await timetable.save();

    res.status(201).json({ message: 'Timetable generated', timetable });

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get Latest Timetable
router.get('/latest', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findOne().sort({ generatedAt: -1 });
    if (!timetable) {
      return res.status(404).json({ message: 'No timetable found' });
    }
    res.status(200).json(timetable);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;