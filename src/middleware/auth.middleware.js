import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Extract token from either cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new apiError(401, "Unauthorized request - No token provided");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user associated with the token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new apiError(401, "Invalid access token - User not found");
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error.message);  // Log the error for debugging
        throw new apiError(401, error?.message || "Invalid access token");
    }
});


export const verifyRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new apiError(403, "Access denied");
      }
      next();
    };
};