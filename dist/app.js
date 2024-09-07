"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errors_1 = __importDefault(require("./middleware/errors"));
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urleconded({ limit: "10mb", extended: true }));
const corsOptions = {
    origin: "http://localhost:5173", // Correct origin
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
};
app.use(cookieParser());
// Apply CORS middleware
app.use(cors(corsOptions));
// Handle preflight requests
app.options("*", cors(corsOptions));
// Custom middleware to ensure CORS headers are set
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(express_1.default.json());
const user = require("./routes/userRoute");
app.use("/api/v1", user);
const product = require("./routes/productRoute");
app.use("/api/v1", product);
const cart = require("./routes/cartRoute");
app.use("/api/v1", cart);
const order = require("./routes/orderRoute");
app.use("/api/v1", order);
app.use(errors_1.default);
app.get("/", (req, res) => {
    res.json("Server Working");
});
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
exports.default = app;
