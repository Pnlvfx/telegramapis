import * as z from 'zod';
import { inlineKeyboardMarkupSchema, pollTypeSchema } from './params.ts';
import { locationSchema } from './shared.ts';
import { userSchema } from './user.ts';
import { chatSchema } from './chat.ts';

const messageEntityTypeSchema = z.literal([
  'mention',
  'hashtag',
  'cashtag',
  'bot_command',
  'url',
  'email',
  'phone_number',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
  'pre',
  'text_link',
  'text_mention',
  'spoiler',
  'custom_emoji',
]);

export const messageEntitySchema = z.strictObject({
  type: messageEntityTypeSchema,
  offset: z.number(),
  length: z.number(),
  url: z.string().optional(),
  user: userSchema.optional(),
  language: z.string().optional(),
  custom_emoji_id: z.string().optional(),
});

const fileBaseSchema = z.strictObject({ file_id: z.string(), file_unique_id: z.string(), file_size: z.number().optional() });
export const photoSizeSchema = z.strictObject({ ...fileBaseSchema.shape, width: z.number(), height: z.number() });

export const audioSchema = z.strictObject({
  ...fileBaseSchema.shape,
  duration: z.number(),
  performer: z.string().optional(),
  title: z.string().optional(),
  mime_type: z.string().optional(),
  thumb: photoSizeSchema.optional(),
});

export const animationSchema = z.strictObject({
  ...fileBaseSchema.shape,
  width: z.number(),
  height: z.number(),
  duration: z.number(),
  thumb: photoSizeSchema.optional(),
  file_name: z.string().optional(),
  mime_type: z.string().optional(),
});
export type Animation = z.infer<typeof animationSchema>;

export const gameSchema = z.strictObject({
  title: z.string(),
  description: z.string(),
  photo: z.array(photoSizeSchema),
  text: z.string().optional(),
  text_entities: z.array(messageEntitySchema).optional(),
  animation: z.lazy(() => animationSchema).optional(),
});
export type Game = z.infer<typeof gameSchema>;

const maskPositionSchema = z.strictObject({
  point: z.string(),
  x_shift: z.number(),
  y_shift: z.number(),
  scale: z.number(),
});
export type MaskPosition = z.infer<typeof maskPositionSchema>;

export const stickerTypeSchema = z.literal(['regular', 'mask', 'custom_emoji']);
export type StickerType = z.infer<typeof stickerTypeSchema>;

const fileSchema = fileBaseSchema.extend({ file_path: z.string().optional() });
export type File = z.infer<typeof fileSchema>;

export const stickerSchema = fileBaseSchema.extend({
  type: stickerTypeSchema,
  is_animated: z.boolean(),
  is_video: z.boolean(),
  width: z.number(),
  height: z.number(),
  thumb: photoSizeSchema.optional(),
  emoji: z.string().optional(),
  set_name: z.string().optional(),
  premium_animation: fileSchema.optional(),
  mask_position: maskPositionSchema.optional(),
  custom_emoji_id: z.string().optional(),
});
export type Sticker = z.infer<typeof stickerSchema>;

export const videoSchema = fileBaseSchema.extend({
  width: z.number(),
  height: z.number(),
  duration: z.number(),
  thumb: photoSizeSchema.optional(),
  mime_type: z.string().optional(),
});
export type Video = z.infer<typeof videoSchema>;

export const voiceSchema = fileBaseSchema.extend({
  duration: z.number(),
  mime_type: z.string().optional(),
});
export type Voice = z.infer<typeof voiceSchema>;

export const videoNoteSchema = fileBaseSchema.extend({ length: z.number(), duration: z.number(), thumb: photoSizeSchema.optional() });
export type VideoNote = z.infer<typeof videoNoteSchema>;

export const contactSchema = z.strictObject({
  phone_number: z.string(),
  first_name: z.string(),
  last_name: z.string().optional(),
  user_id: z.number().optional(),
  vcard: z.string().optional(),
});
export type Contact = z.infer<typeof contactSchema>;

export const venueSchema = z.strictObject({
  location: locationSchema,
  title: z.string(),
  address: z.string(),
  foursquare_id: z.string().optional(),
  foursquare_type: z.string().optional(),
});
export type Venue = z.infer<typeof venueSchema>;

const pollOptionSchema = z.strictObject({ text: z.string(), voter_count: z.number() });
export type PollOption = z.infer<typeof pollOptionSchema>;

const pollSchema = z.strictObject({
  id: z.string(),
  question: z.string(),
  options: z.array(pollOptionSchema),
  is_closed: z.boolean(),
  is_anonymous: z.boolean(),
  allows_multiple_answers: z.boolean(),
  type: pollTypeSchema,
  total_voter_count: z.number(),
});
export type Poll = z.infer<typeof pollSchema>;

const shippingAddressSchema = z.strictObject({
  country_code: z.string(),
  state: z.string(),
  city: z.string(),
  street_line1: z.string(),
  street_line2: z.string(),
  post_code: z.string(),
});
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

const orderInfoSchema = z.strictObject({
  name: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
  shipping_address: shippingAddressSchema.optional(),
});
export type OrderInfo = z.infer<typeof orderInfoSchema>;

export const invoiceSchema = z.strictObject({
  title: z.string(),
  description: z.string(),
  start_parameter: z.string(),
  currency: z.string(),
  total_amount: z.number(),
});
export type Invoice = z.infer<typeof invoiceSchema>;

export const successfulPaymentSchema = z.strictObject({
  currency: z.string(),
  total_amount: z.number(),
  invoice_payload: z.string(),
  shipping_option_id: z.string().optional(),
  order_info: orderInfoSchema.optional(),
  telegram_payment_charge_id: z.string(),
  provider_payment_charge_id: z.string(),
});
export type SuccessfulPayment = z.infer<typeof successfulPaymentSchema>;

export const passportFileSchema = z.strictObject({ file_id: z.string(), file_size: z.number(), file_date: z.number() });
export type PassportFile = z.infer<typeof passportFileSchema>;

export const encryptedPassportElementSchema = z.strictObject({
  type: z.string(),
  data: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
  files: z.array(passportFileSchema).optional(),
  front_side: passportFileSchema.optional(),
  reverse_side: passportFileSchema.optional(),
  selfie: passportFileSchema.optional(),
  translation: z.array(passportFileSchema).optional(),
  hash: z.string(),
});
export type EncryptedPassportElement = z.infer<typeof encryptedPassportElementSchema>;

export const encryptedCredentialsSchema = z.strictObject({ data: z.string(), hash: z.string(), secret: z.string() });
export type EncryptedCredentials = z.infer<typeof encryptedCredentialsSchema>;

export const passportDataSchema = z.strictObject({ data: z.array(encryptedPassportElementSchema), credentials: encryptedCredentialsSchema });
export type PassportData = z.infer<typeof passportDataSchema>;

export const webAppDataSchema = z.strictObject({ data: z.string(), button_text: z.string() });
export type WebAppData = z.infer<typeof webAppDataSchema>;

export const diceSchema = z.strictObject({ emoji: z.string(), value: z.number() });
export type Dice = z.infer<typeof diceSchema>;

export const forumTopicCreatedSchema = z.strictObject({ name: z.string(), icon_color: z.number(), icon_custom_emoji_id: z.string() });
export type ForumTopicCreated = z.infer<typeof forumTopicCreatedSchema>;

export const forumTopicClosedSchema = z.strictObject({});
export type ForumTopicClosed = z.infer<typeof forumTopicClosedSchema>;

export const forumTopicEditedSchema = z.strictObject({ name: z.string(), icon_custom_emoji_id: z.string() });
export type ForumTopicEdited = z.infer<typeof forumTopicEditedSchema>;

export const forumTopicReopenedSchema = z.strictObject({});
export type ForumTopicReopened = z.infer<typeof forumTopicReopenedSchema>;

export const generalForumTopicHiddenSchema = z.strictObject({});
export type GeneralForumTopicHidden = z.infer<typeof generalForumTopicHiddenSchema>;

export const generalForumTopicUnhiddenSchema = z.strictObject({});
export type GeneralForumTopicUnhidden = z.infer<typeof generalForumTopicUnhiddenSchema>;

export const userSharedSchema = z.strictObject({ request_id: z.number(), user_id: z.number() });
export type UserShared = z.infer<typeof userSharedSchema>;

export const chatSharedSchema = z.strictObject({ request_id: z.number(), chat_id: z.number() });
export type ChatShared = z.infer<typeof chatSharedSchema>;

export const documentSchema = fileBaseSchema.extend({
  thumb: photoSizeSchema.optional(),
  file_name: z.string().optional(),
  mime_type: z.string().optional(),
});
export type Document = z.infer<typeof documentSchema>;

const inlineQuerySchema = z.strictObject({
  id: z.string(),
  from: userSchema,
  location: locationSchema.optional(),
  query: z.string(),
  offset: z.string(),
});
export type InlineQuery = z.infer<typeof inlineQuerySchema>;

const chosenInlineResultSchema = z.strictObject({
  result_id: z.string(),
  from: userSchema,
  location: locationSchema.optional(),
  inline_message_id: z.string().optional(),
  query: z.string(),
});
export type ChosenInlineResult = z.infer<typeof chosenInlineResultSchema>;

const shippingQuerySchema = z.strictObject({
  id: z.string(),
  from: userSchema,
  invoice_payload: z.string(),
  shipping_address: shippingAddressSchema,
});
export type ShippingQuery = z.infer<typeof shippingQuerySchema>;

const preCheckoutQuerySchema = z.strictObject({
  id: z.string(),
  from: userSchema,
  currency: z.string(),
  total_amount: z.number(),
  invoice_payload: z.string(),
  shipping_option_id: z.string().optional(),
  order_info: orderInfoSchema.optional(),
});
export type PreCheckoutQuery = z.infer<typeof preCheckoutQuerySchema>;

const pollAnswerSchema = z.strictObject({
  poll_id: z.string(),
  user: userSchema,
  option_ids: z.array(z.number()),
});
export type PollAnswer = z.infer<typeof pollAnswerSchema>;

const chatMemberStatusSchema = z.literal(['creator', 'administrator', 'member', 'restricted', 'left', 'kicked']);
export type ChatMemberStatus = z.infer<typeof chatMemberStatusSchema>;

const chatInviteLinkSchema = z.strictObject({
  invite_link: z.string(),
  creator: userSchema,
  is_primary: z.boolean(),
  is_revoked: z.boolean(),
  expire_date: z.number().optional(),
  member_limit: z.number().optional(),
  name: z.string().optional(),
});
export type ChatInviteLink = z.infer<typeof chatInviteLinkSchema>;

const chatMemberSchema = z.strictObject({
  user: userSchema,
  status: chatMemberStatusSchema,
  until_date: z.number().optional(),
  can_be_edited: z.boolean().optional(),
  can_post_messages: z.boolean().optional(),
  can_edit_messages: z.boolean().optional(),
  can_delete_messages: z.boolean().optional(),
  can_restrict_members: z.boolean().optional(),
  can_promote_members: z.boolean().optional(),
  can_change_info: z.boolean().optional(),
  can_invite_users: z.boolean().optional(),
  can_pin_messages: z.boolean().optional(),
  is_member: z.boolean().optional(),
  can_send_messages: z.boolean().optional(),
  can_send_media_messages: z.boolean().optional(),
  can_send_polls: z.boolean().optional(),
  can_send_other_messages: z.boolean().optional(),
  can_add_web_page_previews: z.boolean().optional(),
});
export type ChatMember = z.infer<typeof chatMemberSchema>;

const chatMemberUpdatedSchema = z.strictObject({
  chat: chatSchema,
  from: userSchema,
  date: z.number(),
  old_chat_member: chatMemberSchema,
  new_chat_member: chatMemberSchema,
  invite_link: chatInviteLinkSchema.optional(),
});
export type ChatMemberUpdated = z.infer<typeof chatMemberUpdatedSchema>;

const chatJoinRequestSchema = z.strictObject({
  chat: chatSchema,
  from: userSchema,
  user_chat_id: z.number(),
  date: z.number(),
  bio: z.string().optional(),
  invite_link: chatInviteLinkSchema.optional(),
});

export const messageSchema = z.strictObject({
  message_id: z.number(),
  message_thread_id: z.number().optional(),
  from: userSchema.optional(),
  date: z.number(),
  chat: chatSchema,
  sender_chat: chatSchema.optional(),
  forward_from: userSchema.optional(),
  forward_from_chat: chatSchema.optional(),
  forward_from_message_id: z.number().optional(),
  forward_signature: z.string().optional(),
  forward_sender_name: z.string().optional(),
  forward_date: z.number().optional(),
  is_topic_message: z.boolean().optional(),
  edit_date: z.number().optional(),
  media_group_id: z.string().optional(),
  author_signature: z.string().optional(),
  text: z.string().optional(),
  entities: z.array(messageEntitySchema).optional(),
  caption_entities: z.array(messageEntitySchema).optional(),
  audio: audioSchema.optional(),
  document: documentSchema.optional(),
  animation: animationSchema.optional(),
  game: gameSchema.optional(),
  photo: z.array(photoSizeSchema).optional(),
  sticker: stickerSchema.optional(),
  video: videoSchema.optional(),
  voice: voiceSchema.optional(),
  video_note: videoNoteSchema.optional(),
  caption: z.string().optional(),
  contact: contactSchema.optional(),
  location: locationSchema.optional(),
  venue: venueSchema.optional(),
  poll: pollSchema.optional(),
  new_chat_members: z.array(userSchema).optional(),
  left_chat_member: userSchema.optional(),
  new_chat_title: z.string().optional(),
  new_chat_photo: z.array(photoSizeSchema).optional(),
  delete_chat_photo: z.boolean().optional(),
  group_chat_created: z.boolean().optional(),
  supergroup_chat_created: z.boolean().optional(),
  channel_chat_created: z.boolean().optional(),
  migrate_to_chat_id: z.number().optional(),
  migrate_from_chat_id: z.number().optional(),
  invoice: invoiceSchema.optional(),
  successful_payment: successfulPaymentSchema.optional(),
  connected_website: z.string().optional(),
  passport_data: passportDataSchema.optional(),
  reply_markup: inlineKeyboardMarkupSchema.optional(),
  web_app_data: webAppDataSchema.optional(),
  is_automatic_forward: z.boolean().optional(),
  has_protected_content: z.boolean().optional(),
  dice: diceSchema.optional(),
  forum_topic_created: forumTopicCreatedSchema.optional(),
  forum_topic_edited: forumTopicEditedSchema.optional(),
  forum_topic_closed: forumTopicClosedSchema.optional(),
  forum_topic_reopened: forumTopicReopenedSchema.optional(),
  general_forum_topic_hidden: generalForumTopicHiddenSchema.optional(),
  general_forum_topic_unhidden: generalForumTopicUnhiddenSchema.optional(),
  has_media_spoiler: z.boolean().optional(),
  user_shared: userSharedSchema.optional(),
  chat_shared: chatSharedSchema.optional(),
});

export const callbackQuerySchema = z.strictObject({
  id: z.string(),
  from: userSchema,
  message: z.lazy(() => messageSchema).optional(),
  inline_message_id: z.string().optional(),
  chat_instance: z.string(),
  data: z.string().optional(),
  game_short_name: z.string().optional(),
});

export const updateSchema = z.strictObject({
  update_id: z.number(),
  message: z.lazy(() => messageSchema).optional(),
  edited_message: z.lazy(() => messageSchema).optional(),
  channel_post: z.lazy(() => messageSchema).optional(),
  edited_channel_post: z.lazy(() => messageSchema).optional(),
  inline_query: inlineQuerySchema.optional(),
  chosen_inline_result: chosenInlineResultSchema.optional(),
  callback_query: callbackQuerySchema.optional(),
  shipping_query: shippingQuerySchema.optional(),
  pre_checkout_query: preCheckoutQuerySchema.optional(),
  poll: pollSchema.optional(),
  poll_answer: pollAnswerSchema.optional(),
  my_chat_member: chatMemberUpdatedSchema.optional(),
  chat_member: chatMemberUpdatedSchema.optional(),
  chat_join_request: chatJoinRequestSchema.optional(),
});

export type CallbackQuery = z.infer<typeof callbackQuerySchema>;
export type ChatJoinRequest = z.infer<typeof chatJoinRequestSchema>;
export type Audio = z.infer<typeof audioSchema>;
export type MessageEntityType = z.infer<typeof messageEntityTypeSchema>;
export type MessageEntity = z.infer<typeof messageEntitySchema>;
export type PhotoSize = z.infer<typeof photoSizeSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Update = z.infer<typeof updateSchema>;
