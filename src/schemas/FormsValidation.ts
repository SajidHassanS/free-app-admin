import { passwordRegex } from "@/lib/helpers";
import * as z from "zod";

const createAccountFormSchema = z
  .object({
    username: z.string().nonempty({
      message: "Enter username",
    }),
    phone: z.string().nonempty({
      message: "Enter phone number.",
    }),
    role: z.string().nonempty({
      message: "Select Role",
    }),
    referCode: z.string().nonempty({
      message: "Enter reffer code",
    }),
    password: z
      .string()
      .nonempty({
        message: "Enter password",
      })
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one numeric digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z
      .string()
      .nonempty({
        message: "Enter confirm password",
      })
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginAccountFormSchema = z.object({
  username: z.string().nonempty({
    message: "Enter username",
  }),
  password: z
    .string()
    .nonempty({
      message: "Password is required.",
    })
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one numeric digit")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

const profileFormSchema = z.object({
  username: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .optional(),
  role: z.string().optional(),
  verified: z.boolean().optional(),
  profileImg: z.string().url().nullable().optional(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const updateProjectFormSchema = z.object({
  title: z.string().optional(),
  trade: z.string().optional(),
  sector: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  location: z.array(z.number()).length(2).optional(),
  address: z.string().optional(),
  tehsil: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deadline: z.string().optional(),
  totalSlots: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .optional(),
});

const projectFormSchema = z
  .object({
    title: z.string().nonempty({ message: "Project Title is required." }),
    trade: z.string().nonempty({ message: "Trade selection is required." }),
    sector: z.string().nonempty({ message: "Sector is required." }),
    description: z.string().nonempty({ message: "Description is required." }),
    requirements: z
      .string()
      .nonempty({ message: "Requirements are required." }),
    location: z
      .array(z.number())
      .length(2, { message: "Location must contain latitude and longitude." }),
    address: z.string().nonempty({ message: "Address is required." }),
    tehsil: z.string().nonempty({ message: "Tehsil is required." }),
    district: z.string().nonempty({ message: "District is required." }),
    province: z.string().nonempty({ message: "Province is required." }),
    duration: z.string().nonempty({ message: "Duration is required." }),
    startDate: z.string().nonempty({ message: "Start Date is required." }),
    endDate: z.string().nonempty({ message: "End Date is required." }),
    deadline: z
      .string()
      .nonempty({ message: "Application Deadline is required." }),
    totalSlots: z.string().nonempty({ message: "Total Slots are required." }),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be greater than start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.startDate) > new Date(data.deadline), {
    message: "Deadline must be smaller than start date",
    path: ["deadline"],
  });

const addNewSupplierFormSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    countryCode: z.string().min(2, "Country code is required"),
    phone: z.string().min(10, "Phone is required"),
    password: z.string().min(6, "Password is required"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const addEmailRewardFormSchema = z.object({
  reward: z.string().nonempty({
    message: "Enter reward",
  }),
});

const addWithdrawThresholdFormSchema = z.object({
  threshold: z.string().nonempty({
    message: "Enter threshold",
  }),
});

const addBonusFormSchema = z.object({
  bonus: z.string().nonempty({
    message: "Enter bonus",
  }),
});

const addPasswordSchema = z.object({
  passwords: z
    .array(
      z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(
          passwordRegex,
          "Password must contain at least one uppercase letter, one numeric digit and one special character."
        )
    )
    .min(1, "At least one password is required"),
});

const bulkEmailUpdate = z.object({
  status: z.string().nonempty({
    message: "Select Status",
  }),
  remarks: z.string().nonempty({
    message: "Enter Remarks",
  }),
});

const withdrawlUpdate = z.object({
  action: z.string().nonempty({
    message: "Select Action",
  }),
});

export {
  createAccountFormSchema,
  loginAccountFormSchema,
  profileFormSchema,
  projectFormSchema,
  passwordSchema,
  updateProjectFormSchema,
  addNewSupplierFormSchema,
  addPasswordSchema,
  addEmailRewardFormSchema,
  addWithdrawThresholdFormSchema,
  addBonusFormSchema,
  bulkEmailUpdate,
  withdrawlUpdate,
};
