import mongoose from "mongoose";

const actionCardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    effectType: {
      type: String,
      required: true,
      trim: true
    },
    effectValue: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default mongoose.model("ActionCard", actionCardSchema);

