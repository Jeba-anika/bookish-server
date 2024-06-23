export type TUserSignup = {
  name: string;
  email: string;
  address: string;
  password: string;
  contactNo: string;
  role: "admin" | "buyer" | "seller";
};
