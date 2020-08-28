import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface L33tArguments {
  msg: string;
}

class L33TCommand extends Command {
  constructor() {
    super("l33t", {
      aliases: ["l33t", "leet"],
      description: {
        content: "Convert a message into l33t speak.",
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

  async exec(message: Message, args: L33tArguments): Promise<Message> {
    if (args.msg.trim() == "") throw "No message provided.";
    const msg = args.msg
      .replace(/the/gi, "t3h")
      .replace(/owned/gi, "pwn3d")
      .replace(/a/g, "@")
      .replace(/A/g, "4")
      .replace(/B/g, "8")
      .replace(/c/gi, "(")
      .replace(/e/gi, "3")
      .replace(/f/gi, "ph")
      .replace(/H/g, "#")
      .replace(/i/gi, "1")
      .replace(/o/gi, "0")
      .replace(/T/g, "7")
      .replace(/S/g, "5");
    return message.util!.reply(msg);
  }
}

export default L33TCommand;
