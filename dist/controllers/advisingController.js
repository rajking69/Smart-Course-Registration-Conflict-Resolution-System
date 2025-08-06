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
exports.getAdvisingHistory = exports.updateSessionStatus = exports.scheduleAdvisingSession = exports.getAdvisorAvailability = exports.setAdvisorAvailability = void 0;
const database_1 = __importDefault(require("../config/database"));
const auth_types_1 = require("../types/auth.types");
const advising_types_1 = require("../types/advising.types");
const notificationController_1 = require("../controllers/notificationController");
const advising_types_2 = require("../types/advising.types");
const setAdvisorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role !== auth_types_1.UserRole.ADVISOR) {
            return res.status(403).json({ message: 'Only advisors can set availability' });
        }
        const availabilitySlots = req.body.availability;
        const advisorId = req.user.userId;
        // Clear existing availability
        yield database_1.default.execute('DELETE FROM advisor_availability WHERE advisor_id = ?', [advisorId]);
        // Insert new availability slots
        for (const slot of availabilitySlots) {
            yield database_1.default.execute(`INSERT INTO advisor_availability 
                (advisor_id, day_of_week, start_time, end_time, is_available) 
                VALUES (?, ?, ?, ?, ?)`, [advisorId, slot.dayOfWeek, slot.startTime, slot.endTime, true]);
        }
        res.json({ message: 'Availability updated successfully' });
    }
    catch (error) {
        console.error('Set availability error:', error);
        res.status(500).json({ message: 'Error setting availability' });
    }
});
exports.setAdvisorAvailability = setAdvisorAvailability;
const getAdvisorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const advisorId = req.params.advisorId;
        const [availability] = yield database_1.default.execute('SELECT * FROM advisor_availability WHERE advisor_id = ? AND is_available = true', [advisorId]);
        res.json(availability);
    }
    catch (error) {
        console.error('Get availability error:', error);
        res.status(500).json({ message: 'Error fetching advisor availability' });
    }
});
exports.getAdvisorAvailability = getAdvisorAvailability;
const scheduleAdvisingSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role !== auth_types_1.UserRole.STUDENT) {
            return res.status(403).json({ message: 'Only students can schedule advising sessions' });
        }
        const sessionInput = req.body;
        const studentId = req.user.userId;
        // Verify advisor exists and is active
        const [advisors] = yield database_1.default.execute('SELECT id FROM users WHERE id = ? AND role = ?', [sessionInput.advisorId, auth_types_1.UserRole.ADVISOR]);
        if (advisors.length === 0) {
            return res.status(404).json({ message: 'Advisor not found' });
        }
        // Check if the time slot is available
        const sessionDate = new Date(sessionInput.dateTime);
        const dayOfWeek = sessionDate.getDay();
        const timeString = sessionDate.toTimeString().slice(0, 5);
        const [availableSlots] = yield database_1.default.execute(`SELECT * FROM advisor_availability 
            WHERE advisor_id = ? 
            AND day_of_week = ? 
            AND start_time <= ? 
            AND end_time > ?
            AND is_available = true`, [sessionInput.advisorId, dayOfWeek, timeString, timeString]);
        if (availableSlots.length === 0) {
            return res.status(400).json({ message: 'Selected time slot is not available' });
        }
        // Check for existing sessions at the same time
        const [existingSessions] = yield database_1.default.execute(`SELECT * FROM advising_sessions 
            WHERE advisor_id = ? 
            AND date_time = ?
            AND status = ?`, [sessionInput.advisorId, sessionInput.dateTime, advising_types_1.AdvisingSessionStatus.SCHEDULED]);
        if (existingSessions.length > 0) {
            return res.status(400).json({ message: 'Time slot already booked' });
        }
        // Create the advising session
        const [result] = yield database_1.default.execute(`INSERT INTO advising_sessions 
            (student_id, advisor_id, date_time, status, notes) 
            VALUES (?, ?, ?, ?, ?)`, [
            studentId,
            sessionInput.advisorId,
            sessionInput.dateTime,
            advising_types_1.AdvisingSessionStatus.SCHEDULED,
            sessionInput.notes || null
        ]);
        // Notify advisor
        yield (0, notificationController_1.createNotification)({
            userId: sessionInput.advisorId,
            title: 'New Advising Session Scheduled',
            message: `A new advising session has been scheduled for ${sessionInput.dateTime}`,
            type: advising_types_2.NotificationType.ADVISING
        });
        res.status(201).json({
            message: 'Advising session scheduled successfully',
            sessionId: result.insertId
        });
    }
    catch (error) {
        console.error('Schedule session error:', error);
        res.status(500).json({ message: 'Error scheduling advising session' });
    }
});
exports.scheduleAdvisingSession = scheduleAdvisingSession;
const updateSessionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || req.user.role !== auth_types_1.UserRole.ADVISOR) {
            return res.status(403).json({ message: 'Only advisors can update session status' });
        }
        const { sessionId } = req.params;
        const { status, notes } = req.body;
        if (!Object.values(advising_types_1.AdvisingSessionStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        // Get session details
        const [sessions] = yield database_1.default.execute('SELECT * FROM advising_sessions WHERE id = ?', [sessionId]);
        if (sessions.length === 0) {
            return res.status(404).json({ message: 'Session not found' });
        }
        const session = sessions[0];
        // Verify the advisor owns this session
        if (session.advisor_id !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this session' });
        }
        // Update session
        yield database_1.default.execute('UPDATE advising_sessions SET status = ?, notes = ?, updated_at = NOW() WHERE id = ?', [status, notes || session.notes, sessionId]);
        // Notify student
        yield (0, notificationController_1.createNotification)({
            userId: session.student_id,
            title: 'Advising Session Update',
            message: `Your advising session status has been updated to ${status}`,
            type: advising_types_2.NotificationType.ADVISING
        });
        res.json({ message: 'Session updated successfully' });
    }
    catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({ message: 'Error updating session status' });
    }
});
exports.updateSessionStatus = updateSessionStatus;
const getAdvisingHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const userId = req.user.userId;
        const userRole = req.user.role;
        const { status, page = 1, limit = 10 } = req.query;
        let query = `
            SELECT 
                as.id,
                as.date_time,
                as.status,
                as.notes,
                as.created_at,
                as.updated_at,
                student.id as student_id,
                student.username as student_username,
                advisor.id as advisor_id,
                advisor.username as advisor_username
            FROM advising_sessions as
            JOIN users student ON as.student_id = student.id
            JOIN users advisor ON as.advisor_id = advisor.id
            WHERE 
        `;
        const params = [];
        if (userRole === auth_types_1.UserRole.STUDENT) {
            query += 'as.student_id = ?';
            params.push(userId);
        }
        else if (userRole === auth_types_1.UserRole.ADVISOR) {
            query += 'as.advisor_id = ?';
            params.push(userId);
        }
        else {
            // Admins can see all sessions
            query += '1=1';
        }
        if (status) {
            query += ' AND as.status = ?';
            params.push(status);
        }
        // Add pagination
        const offset = (Number(page) - 1) * Number(limit);
        query += ' ORDER BY as.date_time DESC LIMIT ? OFFSET ?';
        params.push(Number(limit), offset);
        const [sessions] = yield database_1.default.execute(query, params);
        // Get total count for pagination
        const [countResult] = yield database_1.default.execute(`SELECT COUNT(*) as total FROM advising_sessions WHERE ${userRole === auth_types_1.UserRole.STUDENT ? 'student_id = ?' :
            userRole === auth_types_1.UserRole.ADVISOR ? 'advisor_id = ?' : '1=1'}`, userRole === auth_types_1.UserRole.ADMIN ? [] : [userId]);
        res.json({
            sessions,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(countResult[0].total / Number(limit)),
                totalItems: countResult[0].total,
                itemsPerPage: Number(limit)
            }
        });
    }
    catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ message: 'Error fetching advising history' });
    }
});
exports.getAdvisingHistory = getAdvisingHistory;
