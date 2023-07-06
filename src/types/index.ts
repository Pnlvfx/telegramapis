export type METHODPROPS = 'sendMessage' | 'deleteMessage' | 'sendPhoto' | 'getUpdates' | 'setWebhook' | 'setMyCommands' | 'getFile';

export type PollType = 'regular' | 'quiz';

interface WebAppInfo {
  url: string;
}

interface LoginUrl {
  url: string;
  forward_text?: string | undefined;
  bot_username?: string | undefined;
  request_write_access?: boolean | undefined;
}

type CallbackGame = object;

interface InlineKeyboardButton {
  text: string;
  url?: string | undefined;
  callback_data?: string | undefined;
  web_app?: WebAppInfo;
  login_url?: LoginUrl | undefined;
  switch_inline_query?: string | undefined;
  switch_inline_query_current_chat?: string | undefined;
  callback_game?: CallbackGame | undefined;
  pay?: boolean | undefined;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

interface KeyboardButtonPollType {
  type: PollType;
}

interface KeyboardButtonRequestUser {
  request_id: number;
  user_is_bot?: boolean | undefined;
  user_is_premium?: boolean | undefined;
}

interface KeyboardButtonRequestChat {
  request_id: number;
  chat_is_channel: boolean;
  chat_is_forum?: boolean | undefined;
  chat_has_username?: boolean | undefined;
  chat_is_created?: boolean | undefined;
  user_administrator_rights?: boolean | undefined;
  bot_administrator_rights?: boolean | undefined;
  bot_is_member?: boolean | undefined;
}

interface KeyboardButton {
  text: string;
  request_user?: KeyboardButtonRequestUser | undefined;
  request_chat?: KeyboardButtonRequestChat | undefined;
  request_contact?: boolean | undefined;
  request_location?: boolean | undefined;
  request_poll?: KeyboardButtonPollType;
  web_app?: WebAppInfo;
}

interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][];
  is_persistent?: boolean | undefined;
  resize_keyboard?: boolean | undefined;
  one_time_keyboard?: boolean | undefined;
  input_field_placeholder?: string | undefined;
  selective?: boolean | undefined;
}

interface ReplyKeyboardRemove {
  remove_keyboard: boolean;
  selective?: boolean | undefined;
}

interface ForceReply {
  force_reply: boolean;
  input_field_placeholder?: string | undefined;
  selective?: boolean | undefined;
}

type ParseMode = 'Markdown' | 'MarkdownV2' | 'HTML';

interface SendBasicOptions {
  message_thread_id?: number | undefined;
  disable_notification?: boolean | undefined;
  reply_to_message_id?: number | undefined;
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply | undefined;
  protect_content?: boolean | undefined;
  allow_sending_without_reply?: boolean | undefined;
}

export interface SendMessageOptions extends SendBasicOptions {
  parse_mode?: ParseMode | undefined;
  disable_web_page_preview?: boolean | undefined;
}

export interface SendPhotoOptions extends SendBasicOptions {
  has_spoiler?: boolean | undefined;
  parse_mode?: ParseMode | undefined;
  caption?: string | undefined;
}

export interface SendVideoOptions extends SendBasicOptions {
  has_spoiler?: boolean | undefined;
  parse_mode?: ParseMode | undefined;
  duration?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  caption?: string | undefined;
}

export interface BotCommand {
  command: string;
  description: string;
}
