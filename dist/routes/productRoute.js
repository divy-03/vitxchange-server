"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { fetchUser } = require("../middleware/auth");
const { createProduct, getAllProducts, getProductDetails, updateProduct, deleteProduct, } = require("../controllers/productController");
router.route("/product/new").post(fetchUser, createProduct);
router.route("/product/all").get(getAllProducts);
router
    .route("/product/:id")
    .delete(fetchUser, deleteProduct)
    .put(fetchUser, updateProduct)
    .get(getProductDetails);
module.exports = router;
