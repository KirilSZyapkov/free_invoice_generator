import {z} from "zod";

export const userType = z.object({
  clerkId: z.string().min(1, "Id is required!"),
  email: z.string().min(1, "Email is required!"),
  name: z.string().optional(),
})