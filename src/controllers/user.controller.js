import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"

import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const  registerUser = asyncHandler( async(req, res) => {

    const {username, email, password } = req.body 

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
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

export { 
    registerUser 
}