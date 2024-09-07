"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const router = express_1.default.Router();
const { fetchUser } = require("../middleware/auth");
router.route("/cart/add").post(fetchUser, cartController_1.addToCart);
router.route("/cart/items").get(fetchUser, cartController_1.getCartItems);
router.route("/cart/remove").delete(fetchUser, cartController_1.removeFromCart);
router.route("/cart/decquan").delete(fetchUser, cartController_1.decreaseQuant);
module.exports = router;
