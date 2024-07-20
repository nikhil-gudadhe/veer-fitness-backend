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
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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