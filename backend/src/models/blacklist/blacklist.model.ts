import mongoose from "mongoose";

const BlackListTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      immutable: true,
    },
    blackListedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

BlackListTokenSchema.index(
  { token: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 6,
  },
);

export const BlackListModel = mongoose.model("blacklist", BlackListTokenSchema);
