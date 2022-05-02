import { Command } from "discord-akairo";
import { Message } from "discord.js";
import * as storage from "../../../storage";
import * as evergreen from "../../../lib/evergreen";

class EvergreenInitCommand extends Command {
  constructor() {
    super("evergreen", {
      aliases: ["evergreen"],
      description: {
        content: "Initialize evergreen monitoring in this channel.",
      },
      category: "admin",
      channel: "guild",
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    const estore =
      storage.getCollection<evergreen.IEvergreenMon>("evergreen-mon");
    if (estore["evergreen"] == undefined) {
      estore["evergreen"] = {
        channel: message.channel.id,
        last_status: true,
        last_update: 0,
      };
      await evergreen.initEvergreen(message.client);
      message.reply("Now monitoring the Evergreen in this channel.");
    } else {
      message.reply("Already actively monitoring.");
    }
  }
}

export default EvergreenInitCommand;
