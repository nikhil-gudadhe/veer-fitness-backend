import mongoose, { Schema } from 'mongoose';

const invoiceSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    invoiceId: {
      type: String,
      required: true,  
      unique: true,
    },
    memberName: {
      type: String,
      required: true,
    },
    memberEmail: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planDescription: {
      type: String,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    planDuration: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    previousEndDate: {
      type: Date,
    },
    newEndDate: {
      type: Date,
    },
    extensionDuration: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);