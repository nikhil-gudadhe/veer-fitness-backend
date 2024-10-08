import mongoose, { Schema } from 'mongoose';

const enquirySchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    previousGymExperience: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: false,
    },
    fitnessGoal: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: false,
    },
    preferredTimeSlot: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
