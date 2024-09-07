"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { registerUser, loginUser, logOutUser, getCookieToken, getUserProfile, forgotPassword, resetPassword, updatePassword, updateProfile, getUser, getAllUsers, editUserRole, deleteUser, } = require("../controllers/userController");
const { fetchUser, authRole } = require("../middleware/auth");
router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").get(fetchUser, logOutUser);
router.route("/auth/cookie").get(fetchUser, getCookieToken);
router.route("/auth/me").get(fetchUser, getUserProfile);
router.route("/auth/update").put(fetchUser, updateProfile);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(fetchUser, updatePassword);
router
    .route("/admin/users")
    .get(fetchUser, authRole("admin", "owner"), getAllUsers);
router
    .route("/admin/user/:id")
    .get(fetchUser, authRole("admin", "owner"), getUser)
    .put(fetchUser, authRole("owner"), editUserRole)
    .delete(fetchUser, authRole("owner"), deleteUser);
module.exports = router;
