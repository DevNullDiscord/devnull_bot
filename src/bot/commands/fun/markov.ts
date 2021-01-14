import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { mg } from "../../../lib/markov";

interface MarkovArgs {
  msg: string | null;
  parse?: number;
  reset?: boolean;
}

class MarkovCommand extends Command {
  constructor() {
    super("markov", {
      aliases: ["markov"],
      description: {
        content: "Generate text using a markov model.",
        usage: "| markov --parse <N> <input>",
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
          flag: ["--reset", "-R"]
        },
        {
          id: "parse",
          match: "option",
          type: "number",
          flag: ["--parse", "-P"],
        }
      ],
    });
  }
  async exec(message: Message, args: MarkovArgs): Promise<Message> {
    if (args.reset) {
      const ownerID = this.handler.client.ownerID;
      if (
        (typeof ownerID == "string" && message.author.id == ownerID) ||
        (ownerID instanceof Array && ownerID.find((v) => v == message.author.id))
      ) {
        mg.prefixes = [];
        mg.suffixes = {};
        return message.reply("Generator reset.");
      } else {
        return message.reply("I am unable to comply.");
      }
    } else if (args.parse != undefined) {
      if (args.msg == null)
        return message.util!.reply("Please provide input.");
      const st = Date.now();
      mg.parse(args.msg, args.parse);
      return message.reply(`Parsed in ${(Date.now() - st).toFixed(2)}ms`);
    } else if (mg.prefixes.length > 0) {
      let res = mg.generate(150);
      if (res.length > 2000) res = res.substring(0, 2000);
      return message.channel.send(res);
    } else {
      return message.reply("Generator doesn't contain any parsed data.");
    }
  }
}

export default MarkovCommand;
