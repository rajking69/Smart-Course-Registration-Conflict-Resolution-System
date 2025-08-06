"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middlewares/validation");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Public routes
router.post('/register', validation_1.validateRegistration, authController_1.register);
router.post('/login', validation_1.validateLogin, authController_1.login);
// Protected routes
router.get('/profile', auth_1.auth, authController_1.getProfile);
router.put('/profile', auth_1.auth, authController_1.updateProfile);
router.put('/change-password', auth_1.auth, authController_1.changePassword);
exports.default = router;
