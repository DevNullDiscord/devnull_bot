import { Message } from "discord.js";
import axios from "axios";

export interface IAttachment {
  data: Buffer;
  name: string;
  url: string;
}

export async function getAttachments(message: Message): Promise<IAttachment[] | null> {
  if (message.attachments.size == 0) return null;
  const res: IAttachment[] = [];
  for (const ent of message.attachments.values()) {
    if (ent.name == undefined) continue;
    try {
      const body = (await axios.get(ent.url)).data;
      if (typeof body == "string") {
        res.push({
          data: Buffer.from(body),
          name: ent.name,
          url: ent.url,
        });
      }
    } catch (e) {
      // ignore
    }
  }
  return res;
}