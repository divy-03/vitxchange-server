import express, { NextFunction, Request, Response } from "express";
import errorMiddleware from "./middleware/errors";
import cookieParser from "cookie-parser"; 
import bodyParser from "body-parser"; 
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

const corsOptions = {
  origin: ["http://localhost:5173", "https://vitxchange.vercel.app"], // Allow both local and deployed origins
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Middleware for parsing cookies
app.use(cookieParser());

// Routes
const user = require("./routes/userRoute");
app.use("/api/v1", user);

const product = require("./routes/productRoute");
app.use("/api/v1", product);

const cart = require("./routes/cartRoute");
app.use("/api/v1", cart);

const order = require("./routes/orderRoute");
app.use("/api/v1", order);

// Error middleware
app.use(errorMiddleware);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json("Server Working");
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
