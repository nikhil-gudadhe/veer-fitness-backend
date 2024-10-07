import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateUser, changeCurrentPassword, getCurrentUser, getAllUsers } from "../controllers/user.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/edit/:userId").patch(verifyJWT,updateUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/user-account").get(verifyJWT, getCurrentUser)
router.route("/all-users").get(verifyJWT, getAllUsers)

// admin routes
//router.route("/admin/users").get(verifyJWT, verifyRole(['admin']), getAllUsers);

// trainer routes00
//router.route("/trainer/classes").get(verifyJWT, verifyRole(['trainer']), getTrainerClasses);

export default router