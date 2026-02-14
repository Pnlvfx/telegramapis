import * as z from 'zod';

export const locationSchema = z.strictObject({ longitude: z.number(), latitude: z.number() });
export type Location = z.infer<typeof locationSchema>;
