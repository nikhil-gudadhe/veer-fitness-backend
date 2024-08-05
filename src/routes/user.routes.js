import { Router } from "express";
import { registerUser, loginUser, logoutUser, changeCurrentPassword, getCurrentUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/user-account").get(verifyJWT, getCurrentUser)

// admin routes
//router.route("/admin/users").get(verifyJWT, verifyRole(['admin']), getAllUsers);

// trainer routes
//router.route("/trainer/classes").get(verifyJWT, verifyRole(['trainer']), getTrainerClasses);

export default router