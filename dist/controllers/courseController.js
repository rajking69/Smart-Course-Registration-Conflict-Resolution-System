"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveRegistration = exports.registerForCourse = exports.getCourseDetails = exports.listCourses = exports.createCourse = void 0;
const course_types_1 = require("../types/course.types");
const database_1 = __importDefault(require("../config/database"));
const auth_types_1 = require("../types/auth.types");
// Course Management
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== auth_types_1.UserRole.ADMIN) {
            return res.status(403).json({ message: 'Only admins can create courses' });
        }
        const courseInput = req.body;
        const schedule = JSON.stringify(courseInput.schedule);
        const prerequisites = JSON.stringify(courseInput.prerequisites);
        const [result] = yield database_1.default.execute(`INSERT INTO courses (code, name, description, credits, capacity, 
                department_id, schedule, prerequisites, instructor, semester, academic_year)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            courseInput.code,
            courseInput.name,
            courseInput.description,
            courseInput.credits,
            courseInput.capacity,
            courseInput.departmentId,
            schedule,
            prerequisites,
            courseInput.instructor,
            courseInput.semester,
            courseInput.academicYear
        ]);
        res.status(201).json({
            message: 'Course created successfully',
            courseId: result.insertId
        });
    }
    catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ message: 'Error creating course' });
    }
});
exports.createCourse = createCourse;
const listCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { department, semester, instructor, search, page = 1, limit = 10 } = req.query;
        let query = `
            SELECT c.*, d.name as department_name 
            FROM courses c
            LEFT JOIN departments d ON c.department_id = d.id
            WHERE 1=1
        `;
        const params = [];
        if (department) {
            query += ' AND c.department_id = ?';
            params.push(department);
        }
        if (semester) {
            query += ' AND c.semester = ?';
            params.push(semester);
        }
        if (instructor) {
            query += ' AND c.instructor LIKE ?';
            params.push(`%${instructor}%`);
        }
        if (search) {
            query += ' AND (c.name LIKE ? OR c.code LIKE ? OR c.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        // Add pagination
        const offset = (Number(page) - 1) * Number(limit);
        query += ' LIMIT ? OFFSET ?';
        params.push(Number(limit), offset);
        const [courses] = yield database_1.default.execute(query, params);
        // Get total count for pagination
        const [countResult] = yield database_1.default.execute('SELECT COUNT(*) as total FROM courses', []);
        const totalCourses = countResult[0].total;
        res.json({
            courses,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCourses / Number(limit)),
                totalItems: totalCourses,
                itemsPerPage: Number(limit)
            }
        });
    }
    catch (error) {
        console.error('List courses error:', error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
});
exports.listCourses = listCourses;
const getCourseDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.id;
        const [courses] = yield database_1.default.execute(`SELECT c.*, d.name as department_name 
            FROM courses c
            LEFT JOIN departments d ON c.department_id = d.id
            WHERE c.id = ?`, [courseId]);
        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const course = courses[0];
        // Get current enrollment count
        const [enrollmentResult] = yield database_1.default.execute('SELECT COUNT(*) as count FROM registrations WHERE course_id = ? AND status = ?', [courseId, course_types_1.RegistrationStatus.APPROVED]);
        // Get waitlist count
        const [waitlistResult] = yield database_1.default.execute('SELECT COUNT(*) as count FROM waitlist WHERE course_id = ?', [courseId]);
        res.json(Object.assign(Object.assign({}, course), { schedule: JSON.parse(course.schedule), prerequisites: JSON.parse(course.prerequisites), currentEnrollment: enrollmentResult[0].count, waitlistCount: waitlistResult[0].count }));
    }
    catch (error) {
        console.error('Get course details error:', error);
        res.status(500).json({ message: 'Error fetching course details' });
    }
});
exports.getCourseDetails = getCourseDetails;
// Registration Management
const registerForCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role !== auth_types_1.UserRole.STUDENT) {
            return res.status(403).json({ message: 'Only students can register for courses' });
        }
        const { courseId } = req.body;
        const studentId = req.user.userId;
        // Check if already registered
        const [existingReg] = yield database_1.default.execute('SELECT * FROM registrations WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
        if (existingReg.length > 0) {
            return res.status(400).json({ message: 'Already registered for this course' });
        }
        // Get course details
        const [courses] = yield database_1.default.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const course = courses[0];
        // Check prerequisites
        const prerequisites = JSON.parse(course.prerequisites || '[]');
        if (prerequisites.length > 0) {
            const [completedCourses] = yield database_1.default.execute('SELECT course_id FROM registrations WHERE student_id = ? AND status = ?', [studentId, course_types_1.RegistrationStatus.APPROVED]);
            const completedCourseIds = completedCourses.map(c => c.course_id);
            const missingPrereqs = prerequisites.filter((p) => !completedCourseIds.includes(p));
            if (missingPrereqs.length > 0) {
                return res.status(400).json({
                    message: 'Prerequisites not met',
                    missingPrerequisites: missingPrereqs
                });
            }
        }
        // Check current enrollment
        const [enrollmentCount] = yield database_1.default.execute('SELECT COUNT(*) as count FROM registrations WHERE course_id = ? AND status = ?', [courseId, course_types_1.RegistrationStatus.APPROVED]);
        // If course is full, add to waitlist
        if (enrollmentCount[0].count >= course.capacity) {
            // Get current waitlist position
            const [waitlistCount] = yield database_1.default.execute('SELECT COUNT(*) as count FROM waitlist WHERE course_id = ?', [courseId]);
            // Add to waitlist
            yield database_1.default.execute('INSERT INTO waitlist (student_id, course_id, position) VALUES (?, ?, ?)', [studentId, courseId, waitlistCount[0].count + 1]);
            // Create registration with waitlisted status
            yield database_1.default.execute('INSERT INTO registrations (student_id, course_id, status) VALUES (?, ?, ?)', [studentId, courseId, course_types_1.RegistrationStatus.WAITLISTED]);
            return res.status(200).json({
                message: 'Added to waitlist',
                position: waitlistCount[0].count + 1
            });
        }
        // Check schedule conflicts
        const [studentSchedule] = yield database_1.default.execute(`SELECT c.schedule 
            FROM registrations r 
            JOIN courses c ON r.course_id = c.id 
            WHERE r.student_id = ? AND r.status = ?`, [studentId, course_types_1.RegistrationStatus.APPROVED]);
        const newCourseSchedule = JSON.parse(course.schedule);
        const hasConflict = studentSchedule.some(enrolled => {
            const enrolledSchedule = JSON.parse(enrolled.schedule);
            return checkScheduleConflict(newCourseSchedule, enrolledSchedule);
        });
        if (hasConflict) {
            return res.status(400).json({ message: 'Schedule conflict detected' });
        }
        // Create registration
        yield database_1.default.execute('INSERT INTO registrations (student_id, course_id, status) VALUES (?, ?, ?)', [studentId, courseId, course_types_1.RegistrationStatus.PENDING]);
        res.status(201).json({ message: 'Course registration pending approval' });
    }
    catch (error) {
        console.error('Course registration error:', error);
        res.status(500).json({ message: 'Error registering for course' });
    }
});
exports.registerForCourse = registerForCourse;
const approveRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role !== auth_types_1.UserRole.ADMIN) {
            return res.status(403).json({ message: 'Only admins can approve registrations' });
        }
        const { registrationId } = req.params;
        const { status } = req.body;
        if (!Object.values(course_types_1.RegistrationStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        yield database_1.default.execute('UPDATE registrations SET status = ? WHERE id = ?', [status, registrationId]);
        // If approved and there was a waitlist entry, remove it
        if (status === course_types_1.RegistrationStatus.APPROVED) {
            const [registration] = yield database_1.default.execute('SELECT student_id, course_id FROM registrations WHERE id = ?', [registrationId]);
            if (registration.length > 0) {
                yield database_1.default.execute('DELETE FROM waitlist WHERE student_id = ? AND course_id = ?', [registration[0].student_id, registration[0].course_id]);
                // Reorder remaining waitlist positions
                yield database_1.default.execute(`UPDATE waitlist 
                    SET position = position - 1 
                    WHERE course_id = ? AND position > (
                        SELECT position FROM (
                            SELECT position FROM waitlist 
                            WHERE student_id = ? AND course_id = ?
                        ) as temp
                    )`, [registration[0].course_id, registration[0].student_id, registration[0].course_id]);
            }
        }
        res.json({ message: `Registration ${status} successfully` });
    }
    catch (error) {
        console.error('Approve registration error:', error);
        res.status(500).json({ message: 'Error updating registration status' });
    }
});
exports.approveRegistration = approveRegistration;
// Helper function to check schedule conflicts
const checkScheduleConflict = (schedule1, schedule2) => {
    const days1 = new Set(schedule1.days);
    const days2 = new Set(schedule2.days);
    // Check if there are any overlapping days
    const commonDays = [...days1].filter(day => days2.has(day));
    if (commonDays.length === 0)
        return false;
    // Parse time strings
    const [start1, end1] = schedule1.time.split('-').map(timeToMinutes);
    const [start2, end2] = schedule2.time.split('-').map(timeToMinutes);
    // Check time overlap
    return !(end1 <= start2 || end2 <= start1);
};
// Helper function to convert time string to minutes
const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};
