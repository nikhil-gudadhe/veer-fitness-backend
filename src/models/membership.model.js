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
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
  },
  {
    _id: false,
  }
);
