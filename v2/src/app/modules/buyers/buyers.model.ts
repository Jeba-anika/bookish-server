import { Schema, model } from "mongoose";
import { TBuyer } from "./buyers.interface";

const buyerSchema = new Schema<TBuyer>({
  id: { type: String, unique: true },
  email: { type: String, unique: true, required: true, ref: "User" },
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  profileImage: { type: String },
});

export const Buyer = model<TBuyer>("Buyer", buyerSchema);
