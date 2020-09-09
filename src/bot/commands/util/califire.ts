import { Command } from "discord-akairo";
import { Message } from "discord.js";
import axios from "axios";

class CaliFireCommand extends Command {
  constructor() {
    super("califire", {
      aliases: ["califire", "cali", "california"],
      description: {
        content:
          "Whether or not california is on fire. Powered by http://iscaliforniaonfire.com",
        usage: "<command>",
      },
      category: "util",
      ratelimit: 1,
      cooldown: 15000,
    });
  }

  async exec(message: Message): Promise<void> {
    const res = await axios.get("http://iscaliforniaonfire.com");
    const reg = /<h1>(.*)<\/h1>/g;
    const ex = reg.exec(res.data);
    if (ex == null) {
      message.reply(
        "Unable to determine if california is on fire. Please check http://iscaliforniaonfire.com",
      );
    } else {
      message.reply(ex[1].toLowerCase() + ".");
    }
  }
}

export default CaliFireCommand;
