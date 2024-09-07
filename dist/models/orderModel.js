"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    shippingInfo: {
        firstName: {
            type: String,
            required: [true, "Please Enter your first name"],
        },
        lastName: {
            type: String,
            required: [true, "Please Enter your last name"],
        },
        phone: {
            type: Number,
            required: [true, "Please Enter your phone number"],
        },
        campus: {
            type: String,
            required: [true, "Please Enter your campus"],
        },
        hostel: {
            type: String,
            required: [true, "Please Enter your hostel"],
        },
        block: {
            type: String,
            required: [true, "Please Enter your block"],
        },
        wing: {
            type: String,
            required: [true, "Please Enter your wing"],
        },
        room: {
            type: String,
            required: [true, "Please Enter your room"],
        },
    },
    payMethod: {
        type: String,
        required: [true, "Please Enter your payment method"],
    },
    orderItems: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    payInfo: {
        id: {
            type: String,
            // required: true,
        },
        status: {
            type: String,
            // required: true,
        },
    },
    paidAt: {
        type: Date,
    },
    itemsPrice: {
        type: Number,
        required: true,
    },
    shippingPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
