"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
router.get('/', auth_1.auth, notificationController_1.getUserNotifications);
router.put('/:notificationId/read', auth_1.auth, notificationController_1.markNotificationRead);
router.put('/read-all', auth_1.auth, notificationController_1.markAllNotificationsRead);
exports.default = router;
