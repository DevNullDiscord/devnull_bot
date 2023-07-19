import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface IDadReg {
  match: RegExpMatchArray;
}

const DAD_COOLDOWN = 1000 * 60 * 60; // 60 minutes

let lastTime = 0;

class DadBotCommand extends Command {
  constructor() {
    super("dadbot", {
      regex: /\b(?:i am|i'm)\b([^.]*)(?:[.?!]|\n)?/i,
      category: "regex",
    });
  }
  exec(message: Message, args: IDadReg) {
    if (Date.now() - lastTime < DAD_COOLDOWN) return; // ignore if cooldown not reached.
    if (Math.random() > 0.75) {
      return;
    }

    const sub: string = args.match[1].trim();
    if (sub.length > 25) {
      // Don't fire for really long strings
      return;
    }

    message.reply(`Hi ${sub}, I'm dad.`);
    lastTime = Date.now();
  }
}

export default DadBotCommand;
