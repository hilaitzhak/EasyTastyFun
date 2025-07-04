import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true, default: function () { return randomUUID(); } },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);