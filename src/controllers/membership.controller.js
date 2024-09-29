import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Membership } from "../models/membership.model.js";
import { apiError } from "../utils/apiError.js";

// Delete all memberships
export const deleteAllMemberships = asyncHandler(async (req, res) => {
    try {
      // Perform the deletion of all memberships
      await Membership.deleteMany({});
  
      res.status(200).json({
        message: 'All memberships have been deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'An error occurred while deleting memberships',
        error: error.message,
      });
    }
  });