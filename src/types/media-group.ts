import * as z from 'zod';
import { parseModeSchema } from './params.ts';
import { messageEntitySchema } from './webhook.ts';

export const sendMediaGroupOptionsSchema = z.strictObject({
  disable_notification: z.boolean().optional(),
  reply_to_message_id: z.number().optional(),
});
export type SendMediaGroupOptions = z.infer<typeof sendMediaGroupOptionsSchema>;

const inputMediaBaseSchema = z.strictObject({
  media: z.union([z.string(), z.instanceof(Blob)]),
  has_spoiler: z.boolean().optional(),
  caption: z.string().optional(),
  caption_entities: z.array(messageEntitySchema).optional(),
  parse_mode: parseModeSchema.optional(),
});

const inputMediaPhotoSchema = inputMediaBaseSchema.extend({
  type: z.literal('photo'),
});

const inputMediaVideoSchema = inputMediaBaseSchema.extend({
  type: z.literal('video'),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
  supports_streaming: z.boolean().optional(),
});

export const inputMediaSchema = z.discriminatedUnion('type', [inputMediaPhotoSchema, inputMediaVideoSchema]);
export type InputMedia = z.infer<typeof inputMediaSchema>;

export const inputMediaTypeSchema = z.union([z.string(), z.instanceof(Blob)]);
export type InputMediaType = z.infer<typeof inputMediaTypeSchema>;
