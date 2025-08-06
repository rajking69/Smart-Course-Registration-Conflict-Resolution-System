"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    if (Array.isArray(err)) {
        // Handle validation errors
        const errors = err.map(error => ({
            field: error.path,
            message: error.msg
        }));
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors
        });
    }
    if (err instanceof AppError) {
        // Handle operational errors
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Log unexpected errors
    console.error('Unexpected error:', err);
    // Handle unexpected errors
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
};
exports.errorHandler = errorHandler;
