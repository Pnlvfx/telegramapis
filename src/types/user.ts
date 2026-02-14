import * as z from 'zod';

export const userSchema = z.strictObject({
  id: z.number(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
