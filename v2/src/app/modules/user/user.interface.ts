import { Model } from "mongoose";

export interface TUser {
  id?: string;
  email: string;
  password: string;
  role: "admin" | "buyer" | "seller";
  status?: "blocked" | "active";
  isDeleted?: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExist(email: string): TUser | null;
}
