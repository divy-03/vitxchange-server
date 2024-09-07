"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const atlas_1 = require("./atlas");
// import connectDatabase from "./database";
const cloudinary_1 = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });
(0, atlas_1.connectToAtlas)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// // Starting the server
// app.listen(process.env.PORT, () => {
//   console.log(`Server is working on http://localhost:${process.env.PORT}`);
// });
(async () => {
    try {
        await (0, atlas_1.connectToAtlas)(); // Wait for the connection to be established
        app_1.default.listen(process.env.PORT, () => {
            console.log(`Server is working on http://localhost:${process.env.PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to connect to MongoDB Atlas:", err);
    }
})();
