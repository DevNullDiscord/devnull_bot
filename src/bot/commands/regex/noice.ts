import { Command } from "discord-akairo";
import { Message } from "discord.js";

const NOICE_COOLDOWN = 1000 * 60 * 15; // 15 minutes

let lastTime = 0;

class NoiceCommand extends Command {
  constructor() {
    super("noice", {
      regex: /\b(?:420|69)\b/,
      category: "regex",
    });
  }
  exec(message: Message) {
    if (Date.now() - lastTime < NOICE_COOLDOWN) return; // ignore if cooldown not reached.
    message.reply("https://tenor.com/view/nice-noice-nooice-gif-12313523");
    lastTime = Date.now();
  }
}

export default NoiceCommand;
