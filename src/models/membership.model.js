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
    _id: false,
  }
);

const membershipSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Platinum", "Gold", "Silver"],
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
    duration: {
      type: Number,
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
