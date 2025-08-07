"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Course_1 = __importDefault(require("../models/Course"));
const auth_1 = require("../middlewares/auth");
const auth_2 = require("../types/auth");
const router = express_1.default.Router();
// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course_1.default.findAll();
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching courses' });
    }
});
// Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course_1.default.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching course' });
    }
});
// Create new course (Admin only)
router.post('/', (0, auth_1.authMiddleware)([auth_2.UserRole.ADMIN]), async (req, res) => {
    try {
        const course = await Course_1.default.create(req.body);
        res.status(201).json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating course' });
    }
});
// Update course (Admin only)
router.put('/:id', (0, auth_1.authMiddleware)([auth_2.UserRole.ADMIN]), async (req, res) => {
    try {
        const course = await Course_1.default.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.update(req.body);
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating course' });
    }
});
// Delete course (Admin only)
router.delete('/:id', (0, auth_1.authMiddleware)([auth_2.UserRole.ADMIN]), async (req, res) => {
    try {
        const course = await Course_1.default.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.destroy();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting course' });
    }
});
exports.default = router;
