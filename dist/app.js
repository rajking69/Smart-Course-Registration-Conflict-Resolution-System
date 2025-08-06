"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const advisingRoutes_1 = __importDefault(require("./routes/advisingRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Database connection
(0, database_1.connectDB)();
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to SMART-CRS API' });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api', courseRoutes_1.default);
app.use('/api/advising', advisingRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
// Error handling middleware
const errorHandler_1 = require("./middlewares/errorHandler");
app.use(errorHandler_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
