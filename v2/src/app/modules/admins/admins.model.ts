import { Schema, model } from "mongoose";
import { TAdmin } from "./admins.interface";

const adminSchema = new Schema<TAdmin>(
  {
    id: { type: String, unique: true },
    email: { type: String, unique: true, required: true, ref: "User" },
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNo: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    profileImage: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Admin = model<TAdmin>("Admin", adminSchema);
