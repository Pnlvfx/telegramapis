import * as z from 'zod';
import { locationSchema } from './shared.ts';

export const chatTypeSchema = z.literal(['private', 'group', 'supergroup', 'channel']);
export const chatPhotoSchema = z.strictObject({ small_file_id: z.string(), big_file_id: z.string() });
const chatPermissionsSchema = z.strictObject({
  can_send_messages: z.boolean().optional(),
  can_send_audios: z.boolean().optional(),
  can_send_documents: z.boolean().optional(),
  can_send_photos: z.boolean().optional(),
  can_send_videos: z.boolean().optional(),
  can_send_video_notes: z.boolean().optional(),
  can_send_voice_notes: z.boolean().optional(),
  can_send_polls: z.boolean().optional(),
  can_send_other_messages: z.boolean().optional(),
  can_add_web_page_previews: z.boolean().optional(),
  can_change_info: z.boolean().optional(),
  can_invite_users: z.boolean().optional(),
  can_pin_messages: z.boolean().optional(),
  can_manage_topics: z.boolean().optional(),
});

const chatLocationSchema = z.strictObject({ location: locationSchema, address: z.string() });

export const chatSchema = z.strictObject({
  id: z.number(),
  type: chatTypeSchema,
  title: z.string().optional(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  is_forum: z.boolean().optional(),
  photo: chatPhotoSchema.optional(),
  active_usernames: z.array(z.string()).optional(),
  emoji_status_custom_emoji_id: z.string().optional(),
  bio: z.string().optional(),
  has_restricted_voice_and_video_messages: z.boolean().optional(),
  join_to_send_messages: z.boolean().optional(),
  join_by_request: z.boolean().optional(),
  description: z.string().optional(),
  invite_link: z.string().optional(),
  has_aggressive_anti_spam_enabled: z.boolean().optional(),
  has_hidden_members: z.boolean().optional(),
  pinned_message: z.any().optional(),
  permissions: chatPermissionsSchema.optional(),
  can_set_sticker_set: z.boolean().optional(),
  sticker_set_name: z.string().optional(),
  has_private_forwards: z.boolean().optional(),
  has_protected_content: z.boolean().optional(),
  slow_mode_delay: z.number().optional(),
  message_auto_delete_time: z.number().optional(),
  linked_chat_id: z.number().optional(),
  location: chatLocationSchema.optional(),
  all_members_are_administrators: z.boolean().optional(),
});

export type ChatType = z.infer<typeof chatTypeSchema>;
export type ChatPhoto = z.infer<typeof chatPhotoSchema>;
export type ChatPermissions = z.infer<typeof chatPermissionsSchema>;
export type ChatLocation = z.infer<typeof chatLocationSchema>;
export type Chat = z.infer<typeof chatSchema>;
