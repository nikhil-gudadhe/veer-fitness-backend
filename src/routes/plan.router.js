import { Router } from "express";
import {
  createPlan,
  updatePlan,
  getAllPlans,
  getPlanById,
  deletePlan,
} from "../controllers/plan.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

// Create a new plan
router.route("/add").post(verifyJWT, verifyRole(["admin"]), createPlan);

// Update an existing plan
router.route("/edit/:planId").patch(verifyJWT, verifyRole(["admin"]), updatePlan);

// Retrieve all plans
router.route("/all-plans").get(verifyJWT, verifyRole(["admin"]), getAllPlans);

// Retrieve a specific plan
router.route("/:planId").get(verifyJWT, verifyRole(["admin"]), getPlanById);

// Delete a plan
router.route("/delete/:planId").delete(verifyJWT, verifyRole(["admin"]), deletePlan);

export default router;