import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { mg } from "../../../lib/markov";
import { getAttachments } from "../../../lib/attach";

interface MarkovArgs {
  msg: string | null;
  parse?: boolean;
  reset?: boolean;
}

class MarkovCommand extends Command {
  constructor() {
    super("markov", {
      aliases: ["markov"],
      description: {
        content: "Generate text using a markov model.",
        usage: "| markov --parse <input>",
      },
      category: "fun",
      args: [
        {
          id: "msg",
          type: "string",
          match: "text",
          default: null,
        },
        {
          id: "reset",
          match: "flag",
          flag: ["--reset", "-R"],
        },
        {
          id: "parse",
          match: "flag",
          flag: ["--parse", "-P"],
        },
      ],
    });
  }
  async exec(message: Message, args: MarkovArgs): Promise<Message> {
    if (args.reset) {
      const ownerID = this.handler.client.ownerID;
      if (
        (typeof ownerID == "string" && message.author.id == ownerID) ||
        (ownerID instanceof Array &&
          ownerID.find((v) => v == message.author.id))
      ) {
        mg.prefixes = [];
        mg.suffixes = {};
        return message.reply("Generator reset.");
      } else {
        return message.reply("I am unable to comply.");
      }
    } else if (args.parse) {
      if (args.msg == null) {
        const attachments = await getAttachments(message);
        if (attachments == null || attachments.length == 0) {
          return message.util!.reply("Please provide input.");
        } else {
          const att = attachments.find((v) => /.*\.txt/.test(v.name));
          if (att == undefined)
            return message.util!.reply("Please provide input.");
          args.msg = att.data.toString();
        }
      }
      const lines = args.msg.replace(/\r\n/g, "\n").split("\n");
      const st = Date.now();
      for (const line of lines) {
        mg.parse(line, 2);
      }
      const et = Date.now();
      return message.reply(`Parsed in ${et - st} ms`);
    } else if (mg.prefixes.length > 0) {
      let res = mg.generate(300);
      if (res.length > 2000) res = res.substring(0, 2000);
      return message.channel.send(res);
    } else {
      return message.reply("Generator doesn't contain any parsed data.");
    }
  }
}

export default MarkovCommand;
