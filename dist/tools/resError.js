"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resError = (statusCode, error, res) => {
    res.status(statusCode).json({
        success: false,
        error: error,
    });
};
exports.default = resError;
