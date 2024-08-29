export type ChatId = string | number;

export type PollType = 'regular' | 'quiz';

interface WebAppInfo {
  url: string;
}

interface LoginUrl {
  url: string;
  forward_text?: string;
  bot_username?: string;
  request_write_access?: boolean;
}

type CallbackGame = object;

interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: WebAppInfo;
  login_url?: LoginUrl;
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
  callback_game?: CallbackGame;
  pay?: boolean;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

interface KeyboardButtonPollType {
  type: PollType;
}

interface KeyboardButtonRequestUser {
  request_id: number;
  user_is_bot?: boolean;
  user_is_premium?: boolean;
}

interface KeyboardButtonRequestChat {
  request_id: number;
  chat_is_channel: boolean;
  chat_is_forum?: boolean;
  chat_has_username?: boolean;
  chat_is_created?: boolean;
  user_administrator_rights?: boolean;
  bot_administrator_rights?: boolean;
  bot_is_member?: boolean;
}

interface KeyboardButton {
  text: string;
  request_user?: KeyboardButtonRequestUser;
  request_chat?: KeyboardButtonRequestChat;
  request_contact?: boolean;
  request_location?: boolean;
  request_poll?: KeyboardButtonPollType;
  web_app?: WebAppInfo;
}

interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][];
  is_persistent?: boolean;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  input_field_placeholder?: string;
  selective?: boolean;
}

interface ReplyKeyboardRemove {
  remove_keyboard: boolean;
  selective?: boolean;
}

interface ForceReply {
  force_reply: boolean;
  input_field_placeholder?: string;
  selective?: boolean;
}

export type ParseMode = 'Markdown' | 'MarkdownV2' | 'HTML';

interface SendBasicOptions {
  message_thread_id?: number;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply;
  protect_content?: boolean;
  allow_sending_without_reply?: boolean;
}

export interface SendMessageOptions extends SendBasicOptions {
  parse_mode?: ParseMode;
  disable_web_page_preview?: boolean;
}

export interface SendPhotoOptions extends SendBasicOptions {
  has_spoiler?: boolean;
  parse_mode?: ParseMode;
  caption?: string;
}

export interface SendVideoOptions extends SendBasicOptions {
  has_spoiler?: boolean;
  parse_mode?: ParseMode;
  duration?: number;
  width?: number;
  height?: number;
  caption?: string;
}

export interface BotCommand {
  command: string;
  description: string;
}
