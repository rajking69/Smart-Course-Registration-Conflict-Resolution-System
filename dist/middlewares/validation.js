"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdParam = exports.validatePagination = exports.validateAdvisingSession = exports.validateCourseRegistration = exports.validateCourseCreation = exports.validateLogin = exports.validateRegistration = void 0;
const express_validator_1 = require("express-validator");
const auth_types_1 = require("../types/auth.types");
// Helper function to handle validation results
const handleValidationResult = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};
// Authentication validations
exports.validateRegistration = [
    (0, express_validator_1.body)('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .trim(),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('role')
        .isIn(Object.values(auth_types_1.UserRole))
        .withMessage('Invalid user role'),
    (0, express_validator_1.body)('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim(),
    (0, express_validator_1.body)('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .trim(),
    handleValidationResult
];
exports.validateLogin = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    handleValidationResult
];
// Course validations
exports.validateCourseCreation = [
    (0, express_validator_1.body)('code')
        .notEmpty()
        .withMessage('Course code is required')
        .matches(/^[A-Z]{2,4}\d{3,4}$/)
        .withMessage('Invalid course code format (e.g., CS101)'),
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Course name is required')
        .trim(),
    (0, express_validator_1.body)('credits')
        .isInt({ min: 1, max: 6 })
        .withMessage('Credits must be between 1 and 6'),
    (0, express_validator_1.body)('capacity')
        .isInt({ min: 1 })
        .withMessage('Capacity must be at least 1'),
    (0, express_validator_1.body)('schedule')
        .isObject()
        .withMessage('Valid schedule is required'),
    (0, express_validator_1.body)('schedule.days')
        .isArray()
        .withMessage('Schedule days must be an array'),
    (0, express_validator_1.body)('schedule.time')
        .matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
        .withMessage('Invalid time format (e.g., 09:00-10:30)'),
    handleValidationResult
];
// Registration validations
exports.validateCourseRegistration = [
    (0, express_validator_1.body)('courseId')
        .isInt({ min: 1 })
        .withMessage('Valid course ID is required'),
    handleValidationResult
];
// Advising validations
exports.validateAdvisingSession = [
    (0, express_validator_1.body)('advisorId')
        .isInt({ min: 1 })
        .withMessage('Valid advisor ID is required'),
    (0, express_validator_1.body)('dateTime')
        .isISO8601()
        .withMessage('Valid date and time required')
        .custom(value => {
        const date = new Date(value);
        const now = new Date();
        if (date < now) {
            throw new Error('Cannot schedule sessions in the past');
        }
        return true;
    }),
    (0, express_validator_1.body)('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),
    handleValidationResult
];
// Pagination validation
exports.validatePagination = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationResult
];
// ID parameter validation
exports.validateIdParam = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Valid ID is required'),
    handleValidationResult
];
