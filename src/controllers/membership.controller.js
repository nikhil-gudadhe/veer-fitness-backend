import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Membership } from "../models/membership.model.js";
import { Plan } from "../models/plan.model.js";
import { apiError } from "../utils/apiError.js";

// Calculate end date based on plan duration
// const calculateEndDate = (startDate, duration) => {
//   const endDate = new Date(startDate);
//   endDate.setMonth(endDate.getMonth() + duration);
//   return endDate;
// };

// Register new member with membership
// export const registerMember = asyncHandler(async (req, res) => {
//   const { firstName, lastName, email, mobile, gender, age, address, planId } = req.body;

//   const existingMember = await Member.findOne({ email });

//   if (existingMember) {
//     throw new apiError(409, "Member with this email already exists");
//   }

//   const newMember = new Member({
//     firstName,
//     lastName,
//     email,
//     mobile,
//     gender,
//     age,
//     address,
//     joiningDate: new Date(),
//   });

//   await newMember.save();

//   const plan = await Plan.findById(planId);

//   if (!plan) {
//     throw new apiError(404, "Plan not found");
//   }

//   const startDate = new Date();
//   const endDate = calculateEndDate(startDate, plan.duration);

//   const newMembership = new Membership({
//     plan: plan._id,
//     startDate,
//     endDate,
//     status: "active",
//     member: newMember._id,
//   });

//   await newMembership.save();

//   newMember.membership = newMembership._id;
//   await newMember.save();

//   res.status(201).json(new apiResponse(201, newMember, "Member registered successfully"));
// });

// Extend a membership
// export const extendMembership = asyncHandler(async (req, res) => {
//   const { memberId, duration } = req.body;
//   const adminId = req.user._id;

//   const membership = await Membership.findOne({ member: memberId });

//   if (!membership) {
//     throw new apiError(404, "Membership not found");
//   }

//   const previousEndDate = membership.endDate;
//   const newEndDate = new Date(previousEndDate);
//   newEndDate.setMonth(newEndDate.getMonth() + duration);

//   if (isNaN(newEndDate) || duration <= 0 || duration > 12) {
//     throw new apiError(400, "Invalid duration. Must be a number between 1 and 12 representing months.");
//   }

//   membership.endDate = newEndDate;
//   membership.status = "active";
//   membership.extensions.push({
//     previousEndDate,
//     newEndDate,
//     extendedBy: adminId,
//     duration,
//   });

//   await membership.save();

//   res.status(200).json(new apiResponse(200, membership, "Membership extended successfully"));
// });
