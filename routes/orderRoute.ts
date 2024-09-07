import { Router } from "express";
import {
  createOrder,
  delOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrder,
} from "../controllers/orderController";
import { authRole, fetchUser } from "../middleware/auth";
const router = Router();

router.route("/order/new").post(fetchUser, createOrder);
router.route("/orders/my").get(fetchUser, getMyOrders);
router
  .route("/orders/all")
  .get(fetchUser, authRole("admin", "owner"), getAllOrders);
router
  .route("/order/:id")
  .get(fetchUser, authRole("admin", "owner"), getSingleOrder)
  .delete(fetchUser, authRole("admin", "owner"), delOrder)
  .put(fetchUser, authRole("admin", "owner"), updateOrder);

module.exports = router;
