import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface SpongeMockArguments {
  msg: string;
}

class SpongeMockCommand extends Command {
  constructor() {
    super("spongemock", {
      aliases: ["spongemock", "spongebob"],
      description: {
        content: "mOcK sOmEoNe wItH StYlE",
        usage: "<content>",
      },
      category: "fun",
      args: [
        {
          id: "msg",
          type: "string",
          match: "text",
          default: "",
        },
      ],
    });
  }

  async exec(message: Message, args: SpongeMockArguments): Promise<Message> {
    const msg = args.msg.trim();
    if (msg === "") throw new Error("No message provided.");

    let reply = "";
    let upper = false;
    for (const char of msg) {
      if (char.match(/\s/)) {
        reply += char;
        continue;
      }

      if (upper) {
        reply += char.toLocaleUpperCase();
      } else {
        reply += char.toLocaleLowerCase();
      }

      upper = !upper;
    }

    return message.util!.reply(reply);
  }
}

export default SpongeMockCommand;
