"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.route("/order/new").post(auth_1.fetchUser, orderController_1.createOrder);
router.route("/orders/my").get(auth_1.fetchUser, orderController_1.getMyOrders);
router
    .route("/orders/all")
    .get(auth_1.fetchUser, (0, auth_1.authRole)("admin", "owner"), orderController_1.getAllOrders);
router
    .route("/order/:id")
    .get(auth_1.fetchUser, (0, auth_1.authRole)("admin", "owner"), orderController_1.getSingleOrder)
    .delete(auth_1.fetchUser, (0, auth_1.authRole)("admin", "owner"), orderController_1.delOrder)
    .put(auth_1.fetchUser, (0, auth_1.authRole)("admin", "owner"), orderController_1.updateOrder);
module.exports = router;
