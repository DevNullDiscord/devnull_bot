import { Command } from "discord-akairo";
import { Message } from "discord.js";

class TestCommand extends Command {
  constructor() {
    super("test", {
      aliases: ["test", "demo"],
      channel: "guild",
      ownerOnly: true,
    });
  }
  exec(message: Message) {
    message.reply("Test OK!");
  }
}

export default TestCommand;
