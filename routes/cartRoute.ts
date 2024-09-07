import express from "express";
import {
  addToCart,
  decreaseQuant,
  getCartItems,
  removeFromCart,
} from "../controllers/cartController";
const router = express.Router();

const { fetchUser } = require("../middleware/auth");

router.route("/cart/add").post(fetchUser, addToCart);
router.route("/cart/items").get(fetchUser, getCartItems);
router.route("/cart/remove").delete(fetchUser, removeFromCart);
router.route("/cart/decquan").delete(fetchUser, decreaseQuant);

module.exports = router;
