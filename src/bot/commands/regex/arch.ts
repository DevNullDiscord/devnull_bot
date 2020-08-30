import { Command } from "discord-akairo";
import { Message } from "discord.js";

let lastTime: number = 0;

class ArchCommand extends Command {
  constructor() {
    super("arch", {
      regex: /(?:arch|manjaro|antergos|endeavour)\b|ᵃʳᶜʰ/i,
      category: "regex",
    });
  }
  exec(message: Message, args: { match: RegExpMatchArray }) {
    if (Date.now() - lastTime < 60000 * 15) return;
    if (args.match[0] == "ᵃʳᶜʰ") message.channel.send("ᶦ ᵘˢᵉ ᵃʳᶜʰ ᵇᵗʷ");
    else message.channel.send("*I use arch btw*");
    lastTime = Date.now();
  }
}

export default ArchCommand;
