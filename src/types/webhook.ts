import { InlineKeyboardMarkup, PollType } from '.';

export interface CallbackQuery {
  id: string;
  from: User;
  message?: Message | undefined;
  inline_message_id?: string | undefined;
  chat_instance: string;
  data?: string | undefined;
  game_short_name?: string | undefined;
}

export interface Update {
  update_id: number;
  message?: Message | undefined;
  edited_message?: Message | undefined;
  channel_post?: Message | undefined;
  edited_channel_post?: Message | undefined;
  inline_query?: InlineQuery | undefined;
  chosen_inline_result?: ChosenInlineResult | undefined;
  callback_query?: CallbackQuery | undefined;
  shipping_query?: ShippingQuery | undefined;
  pre_checkout_query?: PreCheckoutQuery | undefined;
  poll?: Poll | undefined;
  poll_answer?: PollAnswer | undefined;
  my_chat_member?: ChatMemberUpdated | undefined;
  chat_member?: ChatMemberUpdated | undefined;
  chat_join_request?: ChatJoinRequest | undefined;
}

interface InlineQuery {
  id: string;
  from: User;
  location?: Location | undefined;
  query: string;
  offset: string;
}

interface ChosenInlineResult {
  result_id: string;
  from: User;
  location?: Location | undefined;
  inline_message_id?: string | undefined;
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
  name?: string | undefined;
  phone_number?: string | undefined;
  email?: string | undefined;
  shipping_address?: ShippingAddress | undefined;
}

interface PreCheckoutQuery {
  id: string;
  from: User;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string | undefined;
  order_info?: OrderInfo | undefined;
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
  until_date?: number | undefined;
  can_be_edited?: boolean | undefined;
  can_post_messages?: boolean | undefined;
  can_edit_messages?: boolean | undefined;
  can_delete_messages?: boolean | undefined;
  can_restrict_members?: boolean | undefined;
  can_promote_members?: boolean | undefined;
  can_change_info?: boolean | undefined;
  can_invite_users?: boolean | undefined;
  can_pin_messages?: boolean | undefined;
  is_member?: boolean | undefined;
  can_send_messages?: boolean | undefined;
  can_send_media_messages?: boolean | undefined;
  can_send_polls?: boolean | undefined;
  can_send_other_messages?: boolean | undefined;
  can_add_web_page_previews?: boolean | undefined;
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
  bio?: string | undefined;
  invite_link?: ChatInviteLink | undefined;
}

export interface Message {
  message_id: number;
  message_thread_id?: number | undefined;
  from?: User | undefined;
  date: number;
  chat: Chat;
  sender_chat?: Chat | undefined;
  forward_from?: User | undefined;
  forward_from_chat?: Chat | undefined;
  forward_from_message_id?: number | undefined;
  forward_signature?: string | undefined;
  forward_sender_name?: string | undefined;
  forward_date?: number | undefined;
  is_topic_message?: boolean | undefined;
  reply_to_message?: Message | undefined;
  edit_date?: number | undefined;
  media_group_id?: string | undefined;
  author_signature?: string | undefined;
  text?: string | undefined;
  entities?: MessageEntity[] | undefined;
  caption_entities?: MessageEntity[] | undefined;
  audio?: Audio | undefined;
  document?: Document | undefined;
  animation?: Animation | undefined;
  game?: Game | undefined;
  photo?: PhotoSize[] | undefined;
  sticker?: Sticker | undefined;
  video?: Video | undefined;
  voice?: Voice | undefined;
  video_note?: VideoNote | undefined;
  caption?: string | undefined;
  contact?: Contact | undefined;
  location?: Location | undefined;
  venue?: Venue | undefined;
  poll?: Poll | undefined;
  new_chat_members?: User[] | undefined;
  left_chat_member?: User | undefined;
  new_chat_title?: string | undefined;
  new_chat_photo?: PhotoSize[] | undefined;
  delete_chat_photo?: boolean | undefined;
  group_chat_created?: boolean | undefined;
  supergroup_chat_created?: boolean | undefined;
  channel_chat_created?: boolean | undefined;
  migrate_to_chat_id?: number | undefined;
  migrate_from_chat_id?: number | undefined;
  pinned_message?: Message | undefined;
  invoice?: Invoice | undefined;
  successful_payment?: SuccessfulPayment | undefined;
  connected_website?: string | undefined;
  passport_data?: PassportData | undefined;
  reply_markup?: InlineKeyboardMarkup | undefined;
  web_app_data?: WebAppData | undefined;
  is_automatic_forward?: boolean | undefined;
  has_protected_content?: boolean | undefined;
  dice?: Dice | undefined;
  forum_topic_created?: ForumTopicCreated | undefined;
  forum_topic_edited?: ForumTopicEdited | undefined;
  forum_topic_closed?: ForumTopicClosed | undefined;
  forum_topic_reopened?: ForumTopicReopened | undefined;
  general_forum_topic_hidden?: GeneralForumTopicHidden | undefined;
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden | undefined;
  has_media_spoiler?: boolean | undefined;
  user_shared?: UserShared | undefined;
  chat_shared?: ChatShared | undefined;
}

interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string | undefined;
  username?: string | undefined;
  language_code?: string | undefined;
}

type ChatType = 'private' | 'group' | 'supergroup' | 'channel';

interface ChatPhoto {
  small_file_id: string;
  big_file_id: string;
}

interface ChatPermissions {
  can_send_messages?: boolean | undefined;
  can_send_audios?: boolean | undefined;
  can_send_documents?: boolean | undefined;
  can_send_photos?: boolean | undefined;
  can_send_videos?: boolean | undefined;
  can_send_video_notes?: boolean | undefined;
  can_send_voice_notes?: boolean | undefined;
  can_send_polls?: boolean | undefined;
  can_send_other_messages?: boolean | undefined;
  can_add_web_page_previews?: boolean | undefined;
  can_change_info?: boolean | undefined;
  can_invite_users?: boolean | undefined;
  can_pin_messages?: boolean | undefined;
  can_manage_topics?: boolean | undefined;
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
  title?: string | undefined;
  username?: string | undefined;
  first_name?: string | undefined;
  last_name?: string | undefined;
  is_forum?: boolean | undefined;
  photo?: ChatPhoto | undefined;
  active_usernames?: string[] | undefined;
  emoji_status_custom_emoji_id?: string | undefined;
  bio?: string | undefined;
  has_restricted_voice_and_video_messages?: boolean | undefined;
  join_to_send_messages?: boolean | undefined;
  join_by_request?: boolean | undefined;
  description?: string | undefined;
  invite_link?: string | undefined;
  has_aggressive_anti_spam_enabled?: boolean | undefined;
  has_hidden_members?: boolean | undefined;
  pinned_message?: Message | undefined;
  permissions?: ChatPermissions | undefined;
  can_set_sticker_set?: boolean | undefined;
  sticker_set_name?: string | undefined;
  has_private_forwards?: boolean | undefined;
  has_protected_content?: boolean | undefined;
  slow_mode_delay?: number | undefined;
  message_auto_delete_time?: number | undefined;
  linked_chat_id?: number | undefined;
  location?: ChatLocation | undefined;
  /**
   * @deprecated since version Telegram Bot API 4.4 - July 29, 2019
   */
  all_members_are_administrators?: boolean | undefined;
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
  url?: string | undefined;
  user?: User | undefined;
  language?: string | undefined;
  custom_emoji_id?: string | undefined;
}

export interface FileBase {
  file_id: string;
  file_unique_id: string;
  file_size?: number | undefined;
}

interface PhotoSize extends FileBase {
  width: number;
  height: number;
}

interface Audio extends FileBase {
  duration: number;
  performer?: string | undefined;
  title?: string | undefined;
  mime_type?: string | undefined;
  thumb?: PhotoSize | undefined;
}

interface Game {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string | undefined;
  text_entities?: MessageEntity[] | undefined;
  animation?: Animation | undefined;
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
  thumb?: PhotoSize | undefined;
  emoji?: string | undefined;
  set_name?: string | undefined;
  premium_animation?: File | undefined;
  mask_position?: MaskPosition | undefined;
  custom_emoji_id?: string | undefined;
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
  thumb?: PhotoSize | undefined;
  mime_type?: string | undefined;
}

interface Voice extends FileBase {
  duration: number;
  mime_type?: string | undefined;
}

interface VideoNote extends FileBase {
  length: number;
  duration: number;
  thumb?: PhotoSize | undefined;
}

interface Contact {
  phone_number: string;
  first_name: string;
  last_name?: string | undefined;
  user_id?: number | undefined;
  vcard?: string | undefined;
}

interface Venue {
  location: Location;
  title: string;
  address: string;
  foursquare_id?: string | undefined;
  foursquare_type?: string | undefined;
}

interface SuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string | undefined;
  order_info?: OrderInfo | undefined;
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
  data?: string | undefined;
  phone_number?: string | undefined;
  email?: string | undefined;
  files?: PassportFile[] | undefined;
  front_side?: PassportFile | undefined;
  reverse_side?: PassportFile | undefined;
  selfie?: PassportFile | undefined;
  translation?: PassportFile[] | undefined;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ForumTopicClosed {}

interface ForumTopicEdited {
  name: string;
  icon_custom_emoji_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ForumTopicReopened {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GeneralForumTopicHidden {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GeneralForumTopicUnhidden {}

interface UserShared {
  request_id: number;
  user_id: number;
}

interface ChatShared {
  request_id: number;
  chat_id: number;
}
