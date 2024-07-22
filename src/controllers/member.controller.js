import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Member } from "../models/member.model.js";
import { Membership } from "../models/membership.model.js";
import { apiError } from "../utils/apiError.js";

// Function to calculate end date based on duration
const calculateEndDate = (startDate, duration) => {
  if (isNaN(duration) || duration <= 0 || duration > 12) {
    throw new Error("Invalid duration. Must be a number between 1 and 12 representing months.");
  }
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);
  return endDate;
};

// Register new member
export const registerMember = asyncHandler(async (req, res) => {
  const { firstName, lastName, gender, age, address, mobile, email, duration, membershipType } = req.body;

  if ([firstName, lastName, gender, age, mobile, email].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required")
  }

  const existingMember = await Member.findOne({
    $or: [{ mobile }, { email }]
  });

  if (existingMember) {
    throw new apiError(409, "Member with this email already exists");
  }

  const newMember = new Member({
    firstName, 
    lastName, 
    gender, 
    age, 
    address, 
    mobile, 
    email,
    duration, 
    membershipType,
    joiningDate: new Date(),
  });

  await newMember.save();

  const startDate = new Date();
  const endDate = calculateEndDate(startDate, duration);

  const newMembership = new Membership({
    type: membershipType,
    startDate,
    endDate,
    duration,
    status: "active",
    member: newMember._id,
  });

  await newMembership.save();

  newMember.membership = newMembership._id;
  await newMember.save();

  res.status(201).json(new apiResponse(201, newMember, "Member registered successfully"));
});















// Get all members
export const getAllMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().populate('membership');
  res.status(200).json(new apiResponse(200, members, "All members fetched successfully"));
});

// Get a single member
export const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id).populate('membership');

  if (!member) {
    throw new apiError(404, "Member not found");
  }

  res.status(200).json(new apiResponse(200, member, "Member fetched successfully"));
});

// Update a member
export const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('membership');

  if (!member) {
    throw new apiError(404, "Member not found");
  }

  res.status(200).json(new apiResponse(200, member, "Member updated successfully"));
});

// Delete a member
export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);

  if (!member) {
    throw new apiError(404, "Member not found");
  }

  await Membership.findByIdAndDelete(member.membership);

  res.status(200).json(new apiResponse(200, {}, "Member deleted successfully"));
});

// Extend a membership
export const extendMembership = asyncHandler(async (req, res) => {
  const { memberId, duration } = req.body;
  const adminId = req.user._id;

  const member = await Member.findById(memberId).populate('membership');

  if (!member) {
    throw new apiError(404, "Member not found");
  }

  const membership = await Membership.findById(member.membership._id);

  if (!membership) {
    throw new apiError(404, "Membership not found");
  }

  const previousEndDate = membership.endDate;
  const newEndDate = calculateEndDate(previousEndDate, duration);

  membership.endDate = newEndDate;
  membership.status = "active";
  membership.extensions.push({
    previousEndDate,
    newEndDate,
    extendedBy: adminId,
    duration,
  });

  await membership.save();

  res.status(200).json(new apiResponse(200, membership, "Membership extended successfully"));
});
