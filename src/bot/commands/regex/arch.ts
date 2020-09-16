import { Command } from "discord-akairo";
import { Message } from "discord.js";

let lastTime: number = 0;

class ArchCommand extends Command {
  constructor() {
    super("arch", {
      regex: /\b(?:arch|manjaro|antergos|endeavour|artix|arco)\b|ᵃʳᶜʰ/i,
      category: "regex",
    });
  }
  exec(message: Message, args: { match: RegExpMatchArray }) {
    if (Date.now() - lastTime < 60000 * 15) return;
    let msg: string = "";
    if (args.match[0] == "ᵃʳᶜʰ") msg = "ᶦ ᵘˢᵉ ᵃʳᶜʰ ᵇᵗʷ";
    else msg = "*I use arch btw*";
    setTimeout(() => {
      message.channel.send(msg);
    }, 1500);
    lastTime = Date.now();
  }
}

export default ArchCommand;
