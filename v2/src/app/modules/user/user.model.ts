import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../config";
import { TUser, UserModel } from "./user.interface";

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "buyer", "seller"], required: true },
    status: { type: String, enum: ["blocked", "active"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email });
};

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});

export const User = model<TUser, UserModel>("User", userSchema);
