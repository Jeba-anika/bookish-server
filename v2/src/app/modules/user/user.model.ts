import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>({
  id: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "buyer", "seller"], required: true },
  status: { type: String, enum: ["blocked", "active"], default: "active" },
  isDeleted: { type: Boolean, default: false },
});

export const User = model<TUser>("User", userSchema);
