import { Router } from "express";
import { registerMember, getAllMembers, getMemberById, updateMember, deleteMember, extendMembership } from "../controllers/member.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

// Routes for member management
router.route("/register").post(verifyJWT, verifyRole(["admin"]), registerMember);
router.route("/").get(verifyJWT, verifyRole(["admin", "trainer"]), getAllMembers);
router.route("/:id").get(verifyJWT, verifyRole(["admin", "trainer"]), getMemberById);
router.route("/:id").put(verifyJWT, verifyRole(["admin"]), updateMember);
router.route("/:id").delete(verifyJWT, verifyRole(["admin"]), deleteMember);

// Route to extend membership
router.route("/extend").post(verifyJWT, verifyRole(["admin"]), extendMembership);

export default router;