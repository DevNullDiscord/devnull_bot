import { Command } from "discord-akairo";
import { Message } from "discord.js";

class LMGTFYCommand extends Command {
  constructor() {
    super("lmgtfy", {
      aliases: ["lmgtfy", "google"],
      description: {
        content: "Help someone learn how to Google.",
        usage: "[search]",
      },
      category: "fun",
      args: [
        {
          id: "search",
          type: "string",
          match: "text",
          default: null,
        },
      ],
    });
  }

  async exec(message: Message, args: { search: string | null }) {
    if (args.search == null)
      return await message.util?.send("Missing search terms.");
    const urlBase: string = "https://lmgtfy.app/?q=";
    const url = urlBase + args.search.trim().split(" ").join("+");
    return await message.util?.send(url);
  }
}

export default LMGTFYCommand;
