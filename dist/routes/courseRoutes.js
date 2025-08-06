"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const auth_types_1 = require("../types/auth.types");
const courseController_1 = require("../controllers/courseController");
const router = express_1.default.Router();
// Public routes
router.get('/courses', courseController_1.listCourses);
router.get('/courses/:id', courseController_1.getCourseDetails);
// Protected routes
router.post('/courses', auth_1.auth, (0, auth_1.checkRole)([auth_types_1.UserRole.ADMIN]), courseController_1.createCourse);
router.post('/courses/register', auth_1.auth, (0, auth_1.checkRole)([auth_types_1.UserRole.STUDENT]), courseController_1.registerForCourse);
router.put('/registrations/:registrationId', auth_1.auth, (0, auth_1.checkRole)([auth_types_1.UserRole.ADMIN]), courseController_1.approveRegistration);
exports.default = router;
