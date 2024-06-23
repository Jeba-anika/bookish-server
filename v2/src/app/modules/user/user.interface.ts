export type TUser = {
  id?: string;
  email: string;
  password: string;
  role: "admin" | "buyer" | "seller";
  status?: "blocked" | "active";
  isDeleted?: boolean;
};
