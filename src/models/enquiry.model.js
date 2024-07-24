import mongoose, { Schema } from 'mongoose';

const enquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    previousGymExperience: {
      type: Boolean,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    pastGymDuration: {
      type: Number,
      required: false,
    },
    target: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
