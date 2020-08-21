import { Command } from "discord-akairo";
import { Message } from "discord.js";

class RestartCommand extends Command {
  constructor() {
    super("restart", {
      aliases: ["restart"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    await message.channel.send("Restarting...");
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  }
}

export default RestartCommand;
