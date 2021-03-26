import { Command } from "discord-akairo";
import { Message } from "discord.js";
import axios from "axios";

class EverGreenCommand extends Command {
  constructor() {
    super("evergreen", {
      aliases: ["evergreen", "boatstuck"],
      description: {
        content:
          "Whether or not the Evergreen is stuck. Powered by https://istheshipstillstuck.com",
        usage: "<command>",
      },
      category: "util",
      ratelimit: 1,
      cooldown: 15000,
    });
  }

  async exec(message: Message): Promise<void> {
    const res = await axios.get("https://istheshipstillstuck.com");
    const reg = /Yes\.<\/a>/i;
    if (reg.test(res.data)) {
        message.reply("yes.");
    } else {
        message.reply("nope! It's free!");
    }
  }
}

export default EverGreenCommand;
