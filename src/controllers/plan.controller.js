import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Plan } from "../models/plan.model.js";
import { apiError } from "../utils/apiError.js";

// Create a new plan
export const createPlan = asyncHandler(async (req, res) => {
  
  const { name, price, duration, description } = req.body;

  if ([name, price, duration, description].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required")
  }

  const existingPlan = await Plan.findOne({ name });

  if (existingPlan) {
    throw new apiError(409, "Plan with this name already exists");
  }

  const plan = new Plan({
    name,
    description,
    price,
    duration,
  });

  await plan.save();

  res.status(201).json(new apiResponse(201, plan, "Plan created successfully"));
});

// Update an existing plan
export const updatePlan = asyncHandler(async (req, res) => {
    const { planId } = req.params;
    const { name, price, duration, description } = req.body;
  
    // Validate input fields
    if ([name, price, duration, description].some(field => field === "")) {
      throw new apiError(400, "All fields are required and cannot be empty");
    }
  
    const plan = await Plan.findById(planId);
  
    if (!plan) {
      throw new apiError(404, "Plan not found");
    }
  
    // Update only the provided fields
    if (name !== undefined) plan.name = name;
    if (price !== undefined) plan.price = price;
    if (duration !== undefined) plan.duration = duration;
    if (description !== undefined) plan.description = description;
  
    await plan.save();
  
    res.status(200).json(new apiResponse(200, plan, "Plan updated successfully"));
});

// Retrieve all plans
export const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await Plan.find();

  res.status(200).json(new apiResponse(200, plans, "Plans retrieved successfully"));
});

// Retrieve a specific plan
export const getPlanById = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  const plan = await Plan.findById(planId);

  if (!plan) {
    throw new apiError(404, "Plan not found");
  }

  res.status(200).json(new apiResponse(200, plan, "Plan retrieved successfully"));
});

// Delete a plan
export const deletePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  const plan = await Plan.findByIdAndDelete(planId);

  if (!plan) {
    throw new apiError(404, "Plan not found");
  }

  res.status(200).json(new apiResponse(200, {}, "Plan deleted successfully"));
});