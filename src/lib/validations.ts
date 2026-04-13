import { z } from 'zod';

export const WaitlistSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  route: z.string().min(5, 'Please enter your most traveled route'),
  travelFrequency: z.enum([
    'every-week',
    'few-times-month',
    'monthly',
    'few-times-year'
  ]),
  phone: z.string().optional(),
});

export type WaitlistFormData = z.infer<typeof WaitlistSchema>;
