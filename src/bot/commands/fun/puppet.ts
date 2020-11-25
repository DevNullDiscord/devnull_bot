import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface PuppetArgs {
  msg: string;
}

class PuppetCommand extends Command {
  constructor() {
    super("puppet", {
      aliases: ["puppet", "as-dev-null"],
      description: {
        content: "Make /dev/null say something",
        usage: "<msg>",
      },
      category: "fun",
      args: [
        {
          id: "msg",
          type: "string",
          match: "text",
        },
      ],
    });
  }

  async exec(message: Message, args: PuppetArgs): Promise<Message> {
    const msg = args.msg.trim();
    if (msg === "") {
      throw new Error("No message provided.");
    }

    const response = message.channel.send(msg);
    message.delete().catch(() => {
      /* It's fine if the message couldn't be deleted */
    });
    return response;
  }
}

export default PuppetCommand;
