import type { ParseMode } from './telegram.js';
import type { MessageEntity } from './webhook.js';

export interface SendMediaGroupOptions {
  disable_notification?: boolean;
  reply_to_message_id?: number;
}

interface InputMediaBase {
  media: string | Blob;
  has_spoiler?: boolean;
  caption?: string;
  caption_entities?: MessageEntity[];
  parse_mode?: ParseMode;
}

interface InputMediaPhoto extends InputMediaBase {
  type: 'photo';
}

interface InputMediaVideo extends InputMediaBase {
  type: 'video';
  width?: number;
  height?: number;
  duration?: number;
  supports_streaming?: boolean;
}

export type InputMedia = InputMediaPhoto | InputMediaVideo;
export type InputMediaType = string | Blob;
