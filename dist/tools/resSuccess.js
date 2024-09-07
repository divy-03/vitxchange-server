"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resSuccess = (statusCode, message, res) => {
    res.status(statusCode).json({
        success: true,
        message: message,
    });
};
exports.default = resSuccess;
