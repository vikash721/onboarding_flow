import { z } from 'zod';

export const userSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof userSchema>;
