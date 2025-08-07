"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Register new user
router.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, salt);
        // Create user
        const user = await User_1.default.create({
            ...userData,
            password: hashedPassword,
        });
        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
});
// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find user
        const user = await User_1.default.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.default = router;
