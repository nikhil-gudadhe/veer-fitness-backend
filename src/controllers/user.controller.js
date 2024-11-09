import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"

import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs/dist/bcrypt.js"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new apiError(404, "User not found");
      }
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = bcrypt.hashSync(refreshToken, 10);
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
  
    } catch (error) {
      console.error("Error generating tokens:", error);
      throw new apiError(500, "Something went wrong while generating refresh and access token");
    }
}

const  registerUser = asyncHandler( async(req, res) => {

    const {username, email, password } = req.body 

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }

    const usernamePattern = /^[a-z]+$/;

    if (!usernamePattern.test(username)) {
        throw new apiError(400, "Username must contain only lowercase letters with no spaces, numbers, or special characters");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new apiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select( "-password -refreshToken")

    if(!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user account")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new apiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new apiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiError(401, "Invalid user credentials");
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Update the user's refresh token in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Send tokens as cookies
    const options = {
        httpOnly: true,
        secure: true,
    };
    
    //sameSite: 'Lax',
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, { accessToken, refreshToken }, "User logged in successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedUser) {
        throw new apiError(404, "User not found");
    }

    return res.status(200).json(new apiResponse(200, updatedUser, "User updated successfully"));
});

const logoutUser = asyncHandler(async(req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 } //this removes the field form document
        }, 
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax'
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    
    const { oldPassword, newPassword } = req.body
    
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) {
        throw new apiError(400, "Incorrect old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})
    
    return res.status(200).json(new apiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {

   return res.status(200).json(new apiResponse(200, req.user, "Current user fetched successfully"))

})

const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    const skip = (page - 1) * limit;
  
    // Count total number of users in the collection
    const totalUsers = await User.countDocuments();
  
    // Fetch the users with pagination, sorting, and optional population if needed
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort users by the created date, newest first
  
    res.status(200).json(
      new apiResponse(
        200,
        {
          users,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
        },
        'All users fetched successfully'
      )
    );
})

const searchUsers = asyncHandler(async (req, res) => {
    const { searchTerm = '', page = 1, limit = 10 } = req.query;
    const searchQuery = String(searchTerm);
    const skip = (page - 1) * limit;
  
    // Search users based on username, email, firstName, or lastName
    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
      ],
    })
      .select('-password -refreshToken') // Exclude sensitive fields
      .skip(skip)
      .limit(Number(limit));
  
    // Count the total number of users matching the search criteria
    const totalUsers = await User.countDocuments({
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
      ],
    });
  
    res.status(200).json(
      new apiResponse(
        200,
        {
          users,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: Number(page),
        },
        'Users fetched successfully'
      )
    );
})
  
export { 
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    getAllUsers,
    searchUsers,
    changeCurrentPassword,
    getCurrentUser,
}