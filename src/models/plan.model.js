import mongoose, { Schema } from "mongoose";

const planSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // Duration in months
    }
  },
  {
    timestamps: true,
  }
);

export const Plan = mongoose.model("Plan", planSchema);