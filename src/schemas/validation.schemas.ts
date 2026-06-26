import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(3, "Enter employee ID or mobile number"),
  password: z.string().min(6, "Password too short"),
});

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name required"),

  employeeId: z.string().min(3, "Employee ID required"),

  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Enter valid mobile number"),

  emergencyContact: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter valid emergency contact"),

  bloodGroup: z.string().min(1, "Select blood group"),

  aadhaarLast4: z.string().max(4),
});

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export const changePasswordSchema = z
  .object({
    current: z.string().min(6),
    next: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must have upper, lower, and number",
      ),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
