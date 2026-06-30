import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, uppercase: true, index: true },
    content: { type: String, default: '' },
    version: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('History', historySchema);
