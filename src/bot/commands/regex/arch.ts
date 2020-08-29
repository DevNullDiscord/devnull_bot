import { Command } from "discord-akairo";
import { Message } from "discord.js";

class ArchCommand extends Command {
  constructor() {
    super("temp", {
      regex: /(?:arch linux|arch|manjaro|antergos)\b/i,
      category: "regex",
      cooldown: 60000 * 5,
      ratelimit: 1,
    });
  }
  exec(message: Message) {
    message.channel.send("*I use arch btw*");
  }
}

export default ArchCommand;
