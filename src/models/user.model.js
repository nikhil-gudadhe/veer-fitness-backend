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
            type: String,
            enum: ["admin", "trainer"],
            default: "trainer",
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) { 
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function() {
    const refreshToken = jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    // Hash the refresh token before storing it
    this.refreshToken = bcrypt.hashSync(refreshToken, 10);

    return refreshToken;
};


export const User = mongoose.model('User', userSchema)