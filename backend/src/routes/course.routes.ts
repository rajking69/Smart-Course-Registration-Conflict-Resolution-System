import express from 'express';
import Course from '../models/Course';
import { authMiddleware } from '../middlewares/auth';
import { UserRole } from '../types/auth';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Create new course (Admin only)
router.post('/', authMiddleware([UserRole.ADMIN]), async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Update course (Admin only)
router.put('/:id', authMiddleware([UserRole.ADMIN]), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course' });
  }
});

// Delete course (Admin only)
router.delete('/:id', authMiddleware([UserRole.ADMIN]), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await course.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

export default router;
