import { z } from "zod";

const optionalUrlOrHandle = z.string().trim().optional().nullable();

export const onboardingSubmissionSchema = z.object({
  clerkId: z.string(),
  userEmail: z.string().email().optional().nullable(),
  personal: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    aadhaarPan: z.string().min(1),
    profilePicture: z.string().optional().nullable(),
  }),
  address: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
  family: z.object({
    parentName: z.string().min(1),
    parentPhone: z.string().min(1),
  }),
  bank: z.object({
    bankAccountName: z.string().min(1),
    accountNumber: z.string().min(1),
    ifscCode: z.string().min(1),
    swiftCode: z.string().optional().nullable(),
    linkedPhone: z.string().min(1),
  }),
  social: z.object({
    telegram: z.string().min(1),
    linkedin: optionalUrlOrHandle,
    xHandle: optionalUrlOrHandle,
    github: optionalUrlOrHandle,
  }),
  submittedAt: z.date().default(() => new Date()),
});

export type OnboardingSubmission = z.infer<typeof onboardingSubmissionSchema>;
