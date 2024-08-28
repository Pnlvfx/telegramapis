/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { InlineKeyboardMarkup, PollType } from './index.js';

export interface CallbackQuery {
  id: string;
  from: User;
  message?: Message;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
}

export interface Update {
  update_id: number;
  message?: Message;
  edited_message?: Message;
  channel_post?: Message;
  edited_channel_post?: Message;
  inline_query?: InlineQuery;
  chosen_inline_result?: ChosenInlineResult;
  callback_query?: CallbackQuery;
  shipping_query?: ShippingQuery;
  pre_checkout_query?: PreCheckoutQuery;
  poll?: Poll;
  poll_answer?: PollAnswer;
  my_chat_member?: ChatMemberUpdated;
  chat_member?: ChatMemberUpdated;
  chat_join_request?: ChatJoinRequest;
}

interface InlineQuery {
  id: string;
  from: User;
  location?: Location;
  query: string;
  offset: string;
}

interface ChosenInlineResult {
  result_id: string;
  from: User;
  location?: Location;
  inline_message_id?: string;
  query: string;
}

interface ShippingAddress {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
}

interface ShippingQuery {
  id: string;
  from: User;
  invoice_payload: string;
  shipping_address: ShippingAddress;
}

interface OrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}

interface PreCheckoutQuery {
  id: string;
  from: User;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
}

interface PollOption {
  text: string;
  voter_count: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  is_closed: boolean;
  is_anonymous: boolean;
  allows_multiple_answers: boolean;
  type: PollType;
  total_voter_count: number;
}

interface PollAnswer {
  poll_id: string;
  user: User;
  option_ids: number[];
}

type ChatMemberStatus = 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';

interface ChatInviteLink {
  invite_link: string;
  creator: User;
  is_primary: boolean;
  is_revoked: boolean;
  expire_date?: number;
  member_limit?: number;
  name?: string;
}

interface ChatMember {
  user: User;
  status: ChatMemberStatus;
  until_date?: number;
  can_be_edited?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_delete_messages?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  is_member?: boolean;
  can_send_messages?: boolean;
  can_send_media_messages?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
}

interface ChatMemberUpdated {
  chat: Chat;
  from: User;
  date: number;
  old_chat_member: ChatMember;
  new_chat_member: ChatMember;
  invite_link?: ChatInviteLink;
}

interface ChatJoinRequest {
  chat: Chat;
  from: User;
  user_chat_id: number;
  date: number;
  bio?: string;
  invite_link?: ChatInviteLink;
}

export interface Message {
  message_id: number;
  message_thread_id?: number;
  from?: User;
  date: number;
  chat: Chat;
  sender_chat?: Chat;
  forward_from?: User;
  forward_from_chat?: Chat;
  forward_from_message_id?: number;
  forward_signature?: string;
  forward_sender_name?: string;
  forward_date?: number;
  is_topic_message?: boolean;
  reply_to_message?: Message;
  edit_date?: number;
  media_group_id?: string;
  author_signature?: string;
  text?: string;
  entities?: MessageEntity[];
  caption_entities?: MessageEntity[];
  audio?: Audio;
  document?: Document;
  animation?: Animation;
  game?: Game;
  photo?: PhotoSize[];
  sticker?: Sticker;
  video?: Video;
  voice?: Voice;
  video_note?: VideoNote;
  caption?: string;
  contact?: Contact;
  location?: Location;
  venue?: Venue;
  poll?: Poll;
  new_chat_members?: User[];
  left_chat_member?: User;
  new_chat_title?: string;
  new_chat_photo?: PhotoSize[];
  delete_chat_photo?: boolean;
  group_chat_created?: boolean;
  supergroup_chat_created?: boolean;
  channel_chat_created?: boolean;
  migrate_to_chat_id?: number;
  migrate_from_chat_id?: number;
  pinned_message?: Message;
  invoice?: Invoice;
  successful_payment?: SuccessfulPayment;
  connected_website?: string;
  passport_data?: PassportData;
  reply_markup?: InlineKeyboardMarkup;
  web_app_data?: WebAppData;
  is_automatic_forward?: boolean;
  has_protected_content?: boolean;
  dice?: Dice;
  forum_topic_created?: ForumTopicCreated;
  forum_topic_edited?: ForumTopicEdited;
  forum_topic_closed?: ForumTopicClosed;
  forum_topic_reopened?: ForumTopicReopened;
  general_forum_topic_hidden?: GeneralForumTopicHidden;
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden;
  has_media_spoiler?: boolean;
  user_shared?: UserShared;
  chat_shared?: ChatShared;
}

interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

type ChatType = 'private' | 'group' | 'supergroup' | 'channel';

interface ChatPhoto {
  small_file_id: string;
  big_file_id: string;
}

interface ChatPermissions {
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
}

interface ChatLocation {
  location: Location;
  address: string;
}

interface Location {
  longitude: number;
  latitude: number;
}

interface Chat {
  id: number;
  type: ChatType;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
  photo?: ChatPhoto;
  active_usernames?: string[];
  emoji_status_custom_emoji_id?: string;
  bio?: string;
  has_restricted_voice_and_video_messages?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  description?: string;
  invite_link?: string;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  pinned_message?: Message;
  permissions?: ChatPermissions;
  can_set_sticker_set?: boolean;
  sticker_set_name?: string;
  has_private_forwards?: boolean;
  has_protected_content?: boolean;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
  linked_chat_id?: number;
  location?: ChatLocation;
  /**
   * @deprecated since version Telegram Bot API 4.4 - July 29, 2019
   */
  all_members_are_administrators?: boolean;
}

type MessageEntityType =
  | 'mention'
  | 'hashtag'
  | 'cashtag'
  | 'bot_command'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'pre'
  | 'text_link'
  | 'text_mention'
  | 'spoiler'
  | 'custom_emoji';

interface MessageEntity {
  type: MessageEntityType;
  offset: number;
  length: number;
  url?: string;
  user?: User;
  language?: string;
  custom_emoji_id?: string;
}

export interface FileBase {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
}

interface PhotoSize extends FileBase {
  width: number;
  height: number;
}

interface Audio extends FileBase {
  duration: number;
  performer?: string;
  title?: string;
  mime_type?: string;
  thumb?: PhotoSize;
}

interface Game {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  text_entities?: MessageEntity[];
  animation?: Animation;
}

interface MaskPosition {
  point: string;
  x_shift: number;
  y_shift: number;
  scale: number;
}

type StickerType = 'regular' | 'mask' | 'custom_emoji';

interface Sticker extends FileBase {
  type: StickerType;
  is_animated: boolean;
  is_video: boolean;
  width: number;
  height: number;
  thumb?: PhotoSize;
  emoji?: string;
  set_name?: string;
  premium_animation?: File;
  mask_position?: MaskPosition;
  custom_emoji_id?: string;
}

interface Invoice {
  title: string;
  description: string;
  start_parameter: string;
  currency: string;
  total_amount: number;
}

interface Video extends FileBase {
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  mime_type?: string;
}

interface Voice extends FileBase {
  duration: number;
  mime_type?: string;
}

interface VideoNote extends FileBase {
  length: number;
  duration: number;
  thumb?: PhotoSize;
}

interface Contact {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
  vcard?: string;
}

interface Venue {
  location: Location;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
}

interface SuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}

interface PassportFile {
  file_id: string;
  file_size: number;
  file_date: number;
}

interface EncryptedPassportElement {
  type: string;
  data?: string;
  phone_number?: string;
  email?: string;
  files?: PassportFile[];
  front_side?: PassportFile;
  reverse_side?: PassportFile;
  selfie?: PassportFile;
  translation?: PassportFile[];
  hash: string;
}

interface EncryptedCredentials {
  data: string;
  hash: string;
  secret: string;
}

interface PassportData {
  data: EncryptedPassportElement[];
  credentials: EncryptedCredentials;
}

interface WebAppData {
  data: string;
  button_text: string;
}

interface Dice {
  emoji: string;
  value: number;
}

interface ForumTopicCreated {
  name: string;
  icon_color: number;
  icon_custom_emoji_id: string;
}

interface ForumTopicClosed {}

interface ForumTopicEdited {
  name: string;
  icon_custom_emoji_id: string;
}

interface ForumTopicReopened {}

interface GeneralForumTopicHidden {}

interface GeneralForumTopicUnhidden {}

interface UserShared {
  request_id: number;
  user_id: number;
}

interface ChatShared {
  request_id: number;
  chat_id: number;
}
