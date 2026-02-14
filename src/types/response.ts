import * as z from 'zod';

const errorParametersSchema = z.strictObject({
  retry_after: z.number().optional(),
});

export type TelegramErrorParameters = z.infer<typeof errorParametersSchema>;

export const errorResponseSchema = z.strictObject({
  ok: z.literal(false),
  error_code: z.number(),
  description: z.string(),
  parameters: errorParametersSchema,
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const createResponseSchema = <T extends z.ZodObject>(schema: T) => {
  const successResponse = z.strictObject({
    ok: z.literal(true),
    result: schema,
  });

  const responseSchema = z.discriminatedUnion('ok', [successResponse, errorResponseSchema]);
  return responseSchema as z.ZodType<{ ok: true; result: z.infer<T> } | ErrorResponse>;
};

export const createArrayResponseSchema = <T extends z.ZodObject>(schema: T) => {
  const successResponse = z.strictObject({
    ok: z.literal(true),
    result: z.array(schema),
  });

  const responseSchema = z.discriminatedUnion('ok', [successResponse, errorResponseSchema]);
  return responseSchema as z.ZodType<{ ok: true; result: z.infer<T>[] } | ErrorResponse>;
};

export interface TelegramSuccess<T> {
  ok: true;
  result: T;
}

// Simple boolean result schemas
export const booleanResultSchema = z.strictObject({ ok: z.literal(true), result: z.boolean() });
export type BooleanResult = z.infer<typeof booleanResultSchema>;

// Webhook response schema
export const webhookResponseSchema = z.discriminatedUnion('ok', [
  z.strictObject({ ok: z.literal(true), result: z.boolean(), description: z.string() }),
  errorResponseSchema,
]);

export type WebhookResponse = z.infer<typeof webhookResponseSchema>;
