"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const auth_types_1 = require("../types/auth.types");
const advisingController_1 = require("../controllers/advisingController");
const router = express_1.default.Router();
// Advisor availability routes
router.post('/availability', auth_1.auth, (0, auth_1.checkRole)([auth_types_1.UserRole.ADVISOR]), advisingController_1.setAdvisorAvailability);
router.get('/availability/:advisorId', auth_1.auth, advisingController_1.getAdvisorAvailability);
// Advising session routes
router.post('/sessions', auth_1.auth, (0, auth_1.checkRole)([auth_types_1.UserRole.STUDENT]), advisingController_1.scheduleAdvisingSession);
router.put('/sessions/:sessionId', auth_1.auth, (0, auth_1.checkRole)([auth_types_1.UserRole.ADVISOR]), advisingController_1.updateSessionStatus);
router.get('/sessions/history', auth_1.auth, advisingController_1.getAdvisingHistory);
exports.default = router;
