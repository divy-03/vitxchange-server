"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resError_1 = __importDefault(require("../tools/resError"));
const error = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    if (err.name === "CastError") {
        const message = `Resource not found, invalid: ${err.path}`;
        (0, resError_1.default)(400, message, res);
    }
    if (err.code === 11000) {
        (0, resError_1.default)(403, "User already exists", res);
    }
    return (0, resError_1.default)(err.statusCode, err.message, res);
};
exports.default = error;
