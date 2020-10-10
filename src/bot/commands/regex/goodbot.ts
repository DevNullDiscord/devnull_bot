import { Command } from "discord-akairo";
import { Message } from "discord.js";

class GoodBotCommand extends Command {
  constructor() {
    super("goodbot", {
      regex: /\bgood\b\s?\bbot\b/i,
      category: "regex",
    });
  }
  exec(message: Message) {
    message.react("🙂");
  }
}

export default GoodBotCommand;
