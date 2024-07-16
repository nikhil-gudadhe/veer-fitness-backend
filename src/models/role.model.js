import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        }
    }
)

export const Role = mongoose.model("Role", roleSchema)