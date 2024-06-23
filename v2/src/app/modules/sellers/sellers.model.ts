import { Schema, model } from "mongoose";
import { TSellers } from "./sellers.interface";

const sellerSchema = new Schema<TSellers>({
  id: { type: String, unique: true },
  email: { type: String, unique: true, required: true, ref: "User" },
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  profileImage: { type: String },
});

export const Seller = model<TSellers>("Seller", sellerSchema);
