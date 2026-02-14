import * as z from 'zod';

export const chatIdSchema = z.union([z.string(), z.number()]);
export type ChatId = z.infer<typeof chatIdSchema>;

export const pollTypeSchema = z.literal(['regular', 'quiz']);
export type PollType = z.infer<typeof pollTypeSchema>;

export const webAppInfoSchema = z.strictObject({ url: z.string() });
export type WebAppInfo = z.infer<typeof webAppInfoSchema>;

const loginUrlSchema = z.strictObject({
  url: z.string(),
  forward_text: z.string().optional(),
  bot_username: z.string().optional(),
  request_write_access: z.boolean().optional(),
});
export type LoginUrl = z.infer<typeof loginUrlSchema>;

const callbackGameSchema = z.strictObject({});
export type CallbackGame = z.infer<typeof callbackGameSchema>;

const inlineKeyboardButtonSchema = z.strictObject({
  text: z.string(),
  url: z.string().optional(),
  callback_data: z.string().optional(),
  web_app: webAppInfoSchema.optional(),
  login_url: loginUrlSchema.optional(),
  switch_inline_query: z.string().optional(),
  switch_inline_query_current_chat: z.string().optional(),
  callback_game: callbackGameSchema.optional(),
  pay: z.boolean().optional(),
});
export type InlineKeyboardButton = z.infer<typeof inlineKeyboardButtonSchema>;

export const inlineKeyboardMarkupSchema = z.strictObject({ inline_keyboard: z.array(z.array(inlineKeyboardButtonSchema)) });
export type InlineKeyboardMarkup = z.infer<typeof inlineKeyboardMarkupSchema>;

const keyboardButtonPollTypeSchema = z.strictObject({ type: pollTypeSchema });
export type KeyboardButtonPollType = z.infer<typeof keyboardButtonPollTypeSchema>;

const keyboardButtonRequestUserSchema = z.strictObject({
  request_id: z.number(),
  user_is_bot: z.boolean().optional(),
  user_is_premium: z.boolean().optional(),
});
export type KeyboardButtonRequestUser = z.infer<typeof keyboardButtonRequestUserSchema>;

const keyboardButtonRequestChatSchema = z.strictObject({
  request_id: z.number(),
  chat_is_channel: z.boolean(),
  chat_is_forum: z.boolean().optional(),
  chat_has_username: z.boolean().optional(),
  chat_is_created: z.boolean().optional(),
  user_administrator_rights: z.boolean().optional(),
  bot_administrator_rights: z.boolean().optional(),
  bot_is_member: z.boolean().optional(),
});
export type KeyboardButtonRequestChat = z.infer<typeof keyboardButtonRequestChatSchema>;

const keyboardButtonSchema = z.strictObject({
  text: z.string(),
  request_user: keyboardButtonRequestUserSchema.optional(),
  request_chat: keyboardButtonRequestChatSchema.optional(),
  request_contact: z.boolean().optional(),
  request_location: z.boolean().optional(),
  request_poll: keyboardButtonPollTypeSchema.optional(),
  web_app: webAppInfoSchema.optional(),
});
export type KeyboardButton = z.infer<typeof keyboardButtonSchema>;

const replyKeyboardMarkupSchema = z.strictObject({
  keyboard: z.array(z.array(keyboardButtonSchema)),
  is_persistent: z.boolean().optional(),
  resize_keyboard: z.boolean().optional(),
  one_time_keyboard: z.boolean().optional(),
  input_field_placeholder: z.string().optional(),
  selective: z.boolean().optional(),
});
export type ReplyKeyboardMarkup = z.infer<typeof replyKeyboardMarkupSchema>;

const replyKeyboardRemoveSchema = z.strictObject({
  remove_keyboard: z.boolean(),
  selective: z.boolean().optional(),
});
export type ReplyKeyboardRemove = z.infer<typeof replyKeyboardRemoveSchema>;

const forceReplySchema = z.strictObject({
  force_reply: z.boolean(),
  input_field_placeholder: z.string().optional(),
  selective: z.boolean().optional(),
});
export type ForceReply = z.infer<typeof forceReplySchema>;

export const parseModeSchema = z.literal(['Markdown', 'MarkdownV2', 'HTML']);
export type ParseMode = z.infer<typeof parseModeSchema>;

const sendBasicOptionsSchema = z.strictObject({
  message_thread_id: z.number().optional(),
  disable_notification: z.boolean().optional(),
  reply_to_message_id: z.number().optional(),
  reply_markup: z.union([inlineKeyboardMarkupSchema, replyKeyboardMarkupSchema, replyKeyboardRemoveSchema, forceReplySchema]).optional(),
  protect_content: z.boolean().optional(),
  allow_sending_without_reply: z.boolean().optional(),
});
export type SendBasicOptions = z.infer<typeof sendBasicOptionsSchema>;

export const sendMessageOptionsSchema = z.strictObject({
  ...sendBasicOptionsSchema.shape,
  parse_mode: parseModeSchema.optional(),
  disable_web_page_preview: z.boolean().optional(),
});
export type SendMessageOptions = z.infer<typeof sendMessageOptionsSchema>;

export const sendPhotoOptionsSchema = z.strictObject({
  ...sendBasicOptionsSchema.shape,
  has_spoiler: z.boolean().optional(),
  parse_mode: parseModeSchema.optional(),
  caption: z.string().optional(),
});
export type SendPhotoOptions = z.infer<typeof sendPhotoOptionsSchema>;

export const sendVideoOptionsSchema = z.strictObject({
  ...sendBasicOptionsSchema.shape,
  has_spoiler: z.boolean().optional(),
  parse_mode: parseModeSchema.optional(),
  duration: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
});
export type SendVideoOptions = z.infer<typeof sendVideoOptionsSchema>;

export const sendDocumentOptionsSchema = z.strictObject({
  ...sendBasicOptionsSchema.shape,
  parse_mode: parseModeSchema.optional(),
  caption: z.string().optional(),
  thumbnail: z.union([z.instanceof(Blob), z.instanceof(Buffer)]).optional(),
});
export type SendDocumentOptions = z.infer<typeof sendDocumentOptionsSchema>;

export const botCommandSchema = z.strictObject({ command: z.string(), description: z.string() });
export type BotCommand = z.infer<typeof botCommandSchema>;

export const editMessageTextOptionsSchema = z.strictObject({
  message_thread_id: z.number().optional(),
  parse_mode: parseModeSchema.optional(),
  entities: z.array(z.any()).optional(),
  disable_web_page_preview: z.boolean().optional(),
  reply_markup: z.any().optional(),
});
export type EditMessageTextOptions = z.infer<typeof editMessageTextOptionsSchema>;
