import { Router } from "express";
import { extendMembership } from "../controllers/membership.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

// Route to extend membership
router.route("/extend").post(verifyJWT, verifyRole(["admin"]), extendMembership);

export default router;