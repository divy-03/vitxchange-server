"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToAtlas = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToAtlas() {
    try {
        await mongoose_1.default.connect(String(process.env.ATLAS_URI));
        mongoose_1.default.connection.once("open", () => {
            console.log("Successfully connected to MongoDB Atlas!");
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.error("Error connecting to MongoDB Atlas:", err);
        });
    }
    catch (err) {
        console.error("Failed to connect to MongoDB Atlas:", err);
        process.exit(1); // Exit the process with failure code if connection fails
    }
}
exports.connectToAtlas = connectToAtlas;
exports.default = mongoose_1.default;
