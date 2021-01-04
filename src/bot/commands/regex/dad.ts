import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface IDadReg {
  match: RegExpMatchArray;
}

class DadBotCommand extends Command {
  constructor() {
    super("dadbot", {
      regex: /\b(?:i am|i'm)\b([^.]*)(?:[.?!]|\n)?/i,
      category: "regex",
    });
  }
  exec(message: Message, args: IDadReg) {
    const sub: string = args.match[1].trim();
    message.util!.reply(`Hi ${sub}, I'm dad.`);
  }
}

export default DadBotCommand;
