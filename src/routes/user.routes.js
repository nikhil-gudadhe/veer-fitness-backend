import { Router } from "express";
import { registerUser, loginUser, logoutUser,  updateUser, changeCurrentPassword, getCurrentUser, getAllUsers, searchUsers } from "../controllers/user.controller.js"
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/edit/:userId").patch(verifyJWT,updateUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/user-account").get(verifyJWT, getCurrentUser)
router.route("/all-users").get(verifyJWT, verifyRole(['admin']), getAllUsers)
router.route("/search").get(verifyJWT, verifyRole(["admin", "trainer"]), searchUsers);


// admin routes
//router.route("/admin/users").get(verifyJWT, verifyRole(['admin']), getAllUsers);

// trainer routes
//router.route("/trainer/classes").get(verifyJWT, verifyRole(['trainer']), getTrainerClasses);

export default router