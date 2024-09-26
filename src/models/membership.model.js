import mongoose, { Schema } from "mongoose";

const extensionSchema = new Schema(
  {
    previousEndDate: {
      type: Date,
      required: true,
    },
    newEndDate: {
      type: Date,
      required: true,
    },
    extendedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    extendedAt: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const membershipSchema = new Schema(
  {
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
    extensions: [extensionSchema],
  },
  {
    timestamps: true,
  }
);

export const Membership = mongoose.model("Membership", membershipSchema);