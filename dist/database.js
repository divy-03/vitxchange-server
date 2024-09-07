"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = () => {
    mongoose_1.default
        .connect(String(process.env.MONGODB_URI))
        .then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
        .catch((error) => {
        console.log("Error conecting to DB:", error);
    });
};
exports.default = connectDatabase;
