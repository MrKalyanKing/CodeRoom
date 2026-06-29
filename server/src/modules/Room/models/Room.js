import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    hostToken: { type: String, required: true },
    passwordHash: { type: String, default: null }, // null = open room
    content: { type: String, default: '' },
    version: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
