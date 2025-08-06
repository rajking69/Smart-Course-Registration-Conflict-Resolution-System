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
exports.markAllNotificationsRead = exports.markNotificationRead = exports.getUserNotifications = exports.createNotification = void 0;
const database_1 = __importDefault(require("../config/database"));
const createNotification = (notificationInput) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [result] = yield database_1.default.execute(`INSERT INTO notifications (user_id, title, message, type, is_read) 
            VALUES (?, ?, ?, ?, false)`, [
            notificationInput.userId,
            notificationInput.title,
            notificationInput.message,
            notificationInput.type
        ]);
        return result.insertId;
    }
    catch (error) {
        console.error('Create notification error:', error);
        throw error;
    }
});
exports.createNotification = createNotification;
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { page = 1, limit = 10, unreadOnly = false } = req.query;
        const userId = req.user.userId;
        let query = 'SELECT * FROM notifications WHERE user_id = ?';
        const params = [userId];
        if (unreadOnly) {
            query += ' AND is_read = false';
        }
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        const offset = (Number(page) - 1) * Number(limit);
        params.push(Number(limit), offset);
        const [notifications] = yield database_1.default.execute(query, params);
        // Get total count for pagination
        const [countResult] = yield database_1.default.execute(`SELECT COUNT(*) as total FROM notifications 
            WHERE user_id = ? ${unreadOnly ? 'AND is_read = false' : ''}`, [userId]);
        res.json({
            notifications,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(countResult[0].total / Number(limit)),
                totalItems: countResult[0].total,
                itemsPerPage: Number(limit)
            }
        });
    }
    catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});
exports.getUserNotifications = getUserNotifications;
const markNotificationRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { notificationId } = req.params;
        const userId = req.user.userId;
        // Verify notification belongs to user
        const [notifications] = yield database_1.default.execute('SELECT * FROM notifications WHERE id = ? AND user_id = ?', [notificationId, userId]);
        if (notifications.length === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        yield database_1.default.execute('UPDATE notifications SET is_read = true WHERE id = ?', [notificationId]);
        res.json({ message: 'Notification marked as read' });
    }
    catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
});
exports.markNotificationRead = markNotificationRead;
const markAllNotificationsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const userId = req.user.userId;
        yield database_1.default.execute('UPDATE notifications SET is_read = true WHERE user_id = ?', [userId]);
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
});
exports.markAllNotificationsRead = markAllNotificationsRead;
