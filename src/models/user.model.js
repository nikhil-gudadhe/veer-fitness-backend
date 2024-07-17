import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        firstName: {
            type: String,
            required: false,
            trim: true,
            index: true
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // Cloudinary URL
            required: false
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            trim: true
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role"
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model('User', userSchema)