import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface IDadReg {
  match: RegExpMatchArray;
}

const DAD_COOLDOWN = 1000 * 60 * 5; // 5 minutes

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
    const sub: string = args.match[1].trim();
    message.util!.reply(`Hi ${sub}, I'm dad.`);
    lastTime = Date.now();
  }
}

export default DadBotCommand;
