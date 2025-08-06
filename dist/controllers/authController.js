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
exports.changePassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        // Check if email already exists
        const [existingUsers] = yield database_1.default.execute('SELECT id FROM users WHERE email = ?', [input.email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(input.password, 12);
        // Insert user into database
        const [result] = yield database_1.default.execute('INSERT INTO users (username, email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)', [input.username, input.email, hashedPassword, input.role, input.firstName, input.lastName]);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: result.insertId,
            email: input.email,
            role: input.role
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                username: input.username,
                email: input.email,
                role: input.role,
                firstName: input.firstName,
                lastName: input.lastName
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Get user from database
        const [users] = yield database_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = users[0];
        // Verify password
        const isValidPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const [users] = yield database_1.default.execute('SELECT id, username, email, role, first_name, last_name, created_at, updated_at FROM users WHERE id = ?', [req.user.userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = users[0];
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        });
    }
    catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { username, firstName, lastName } = req.body;
        yield database_1.default.execute('UPDATE users SET username = ?, first_name = ?, last_name = ? WHERE id = ?', [username, firstName, lastName, req.user.userId]);
        res.json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { currentPassword, newPassword } = req.body;
        // Get current user's password
        const [users] = yield database_1.default.execute('SELECT password FROM users WHERE id = ?', [req.user.userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Verify current password
        const isValidPassword = yield bcryptjs_1.default.compare(currentPassword, users[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        // Hash new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        // Update password
        yield database_1.default.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.userId]);
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});
exports.changePassword = changePassword;
