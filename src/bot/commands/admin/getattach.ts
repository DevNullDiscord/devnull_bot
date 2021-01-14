import { Command } from "discord-akairo";
import { MessageAttachment } from "discord.js";
import { Message } from "discord.js";
import { getAttachments } from "../../../lib/attach";

class AttachCommand extends Command {
  constructor() {
    super("attachments", {
      aliases: ["attachments"],
      description: {
        content: "A test command to get attachments",
      },
      category: "admin",
      channel: "guild",
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    const res = await getAttachments(message);
    if (res == null) return message.reply("No attachments.");
    const nt = res.map((att) => new MessageAttachment(att.data, att.name));
    return message.reply("Here are the attachments I got from discord.", nt);
  }
}

export default AttachCommand;
