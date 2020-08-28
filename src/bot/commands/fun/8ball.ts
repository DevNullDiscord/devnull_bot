import { Command } from "discord-akairo";
import { Message } from "discord.js";
import * as rand from "../../../lib/rand";

interface Ball8Args {
  msg: string | null;
}

let answers: string[] = [
  "It is certain.",
  "As I see it, yes.",
  "Reply hazy, try again.",
  "Don't count on it.",
  "It is decidedly so.",
  "Most likely.",
  "Ask again later.",
  "My reply is no.",
  "Without a doubt.",
  "Outlook good.",
  "Better not tell you now.",
  "My sources say no.",
  "Yes - definitely.",
  "Yes.",
  "Cannot predict now.",
  "Outlook not so good.",
  "You may rely on it.",
  "Signs point to yes.",
  "Concentrate and ask again.",
  "Very doubtful.",
];

class Ball8Command extends Command {
  constructor() {
    super("8ball", {
      aliases: ["8ball"],
      description: {
        content: "Ask a question and let the magic 8ball answer it.",
        usage: "[question]",
      },
      category: "fun",
      args: [
        {
          id: "msg",
          type: "string",
          match: "text",
          default: null,
        },
      ],
    });
  }
  async exec(message: Message, args: Ball8Args): Promise<Message> {
    if (args.msg == null)
      return message.util!.reply("Please ask a question to get an answer.");
    rand.randomize(answers);
    const answer: string =
      answers[await rand.srandInRange(answers.length - 1, 0)];
    return message.util!.reply(`*${args.msg}*\n**${answer}**`);
  }
}

export default Ball8Command;
