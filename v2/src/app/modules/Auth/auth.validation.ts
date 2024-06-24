import { z } from "zod";

const useSignUpValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required!",
  }),
  email: z
    .string({
      required_error: "Email is required!",
    })
    .email(),
  address: z.string({
    required_error: "Address is required!",
  }),
  password: z.string({
    required_error: "Password is required!",
  }),
  contactNo: z.string({
    required_error: "Contact No is required!",
  }),
  role: z.enum(["admin", "buyer", "seller"], {
    required_error: "Role is required!",
  }),
});
const useLoginValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required!",
    })
    .email(),

  password: z.string({
    required_error: "Password is required!",
  }),
});

export const AuthValidation = {
  useSignUpValidationSchema,
  useLoginValidationSchema,
};
