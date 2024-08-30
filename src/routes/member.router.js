import { Router } from "express";
import { registerMember, getAllMembers, searchMembers, getMemberById, updateMember, deleteMember, extendMembership, getActiveMembers, getInactiveMembers } from "../controllers/member.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(verifyJWT, verifyRole(["admin"]), registerMember);

router.route("/all-members").get(verifyJWT, verifyRole(["admin", "trainer"]), getAllMembers);

router.route("/search").get(verifyJWT, verifyRole(["admin", "trainer"]), searchMembers);

router.route("/active-members").get(verifyJWT, verifyRole(["admin", "trainer"]), getActiveMembers);

router.route("/inactive-members").get(verifyJWT, verifyRole(["admin", "trainer"]), getInactiveMembers);

router.route("/edit/:memberId").patch(verifyJWT, verifyRole(["admin"]), updateMember);

router.route("/:memberId").get(verifyJWT, verifyRole(["admin", "trainer"]), getMemberById);

router.route("/:memberId").delete(verifyJWT, verifyRole(["admin"]), deleteMember);

router.route("/extend-membership").post(verifyJWT, verifyRole(["admin"]), extendMembership);

export default router;
