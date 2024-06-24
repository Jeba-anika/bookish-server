import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import { Admin } from "../admins/admins.model";
import { Buyer } from "../buyers/buyers.model";
import { Seller } from "../sellers/sellers.model";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TUserLogin, TUserSignup } from "./auth.interface";
import { generateId } from "./auth.utils";

const userSignUp = async (payload: TUserSignup) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const generatedUserId = await generateId(payload.role);
    const userData: TUser = {
      id: generatedUserId,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    };
    await User.create(userData);
    const roleSpecificData = {
      id: generatedUserId,
      name: payload.name,
      email: payload.email,
      contactNo: payload.contactNo,
      address: payload.address,
    };
    let result = null;
    if (payload.role === "buyer") {
      result = await Buyer.create(roleSpecificData);
    } else if (payload.role === "seller") {
      result = await Seller.create(roleSpecificData);
    } else if (payload.role === "admin") {
      result = await Admin.create(roleSpecificData);
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err.message);
  }
};

const userLogin = async (payload: TUserLogin) => {
  const user: TUser | null = await User.isUserExist(payload.email);
  console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user && user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect!");
  }

  const token = jwt.sign(
    { role: user.role, email: user.email, id: user.id },
    config.jwt_secret as string,
    {
      expiresIn: config.jwt_access_expires_in as string,
    }
  );
  const { password, ...userData } = user.toObject();

  return { data: userData, token };
};
export const AuthService = {
  userSignUp,
  userLogin,
};
