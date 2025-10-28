import { z } from "zod";

const userValidationSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z
    .string()
    .email()
    .regex(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim),
  mobilenumber: z.string().min(6).max(15),
  skypeID: z.string().optional(),
  password: z.string().min(6),
  isAdmin: z.boolean().optional(),
});

const signinValidationSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export { userValidationSchema, signinValidationSchema };
