import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female","other"]
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    membership: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
    },
  },
  {
    timestamps: true,
  }
);

export const Member = mongoose.model("Member", memberSchema);