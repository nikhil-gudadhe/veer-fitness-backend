import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Membership } from "../models/membership.model.js";
import { apiError } from "../utils/apiError.js";

// Extend a membership
export const extendMembership = asyncHandler(async (req, res) => {
  const { memberId, duration } = req.body;
  const adminId = req.user._id;

  const membership = await Membership.findOne({ member: memberId });

  if (!membership) {
    throw new apiError(404, "Membership not found");
  }

  const previousEndDate = membership.endDate;
  const newEndDate = new Date(previousEndDate);
  newEndDate.setMonth(newEndDate.getMonth() + duration);

  if (isNaN(newEndDate) || duration <= 0 || duration > 12) {
    throw new apiError(400, "Invalid duration. Must be a number between 1 and 12 representing months.");
  }

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
