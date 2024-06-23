import mongoose from "mongoose";
import { Admin } from "../admins/admins.model";
import { Buyer } from "../buyers/buyers.model";
import { Seller } from "../sellers/sellers.model";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TUserSignup } from "./auth.interface";
import { generateId } from "./auth.utils";

const userSignUp = async (payload: TUserSignup) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const generatedId = await generateId(payload.role);
    const userData: TUser = {
      id: generatedId,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    };
    await User.create(userData);
    const roleSpecificData = {
      id: generateId,
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
export const AuthService = {
  userSignUp,
};
