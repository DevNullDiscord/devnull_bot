import { Command } from "discord-akairo";
import { Message } from "discord.js";

class TestCommand extends Command {
  constructor() {
    super("test", {
      aliases: ["test", "demo"],
      description: {
        content: "A test command to ensure the bot is running.",
      },
      category: "admin",
      channel: "guild",
      ownerOnly: true,
    });
  }
  exec(message: Message) {
    message.reply("Test OK!");
  }
}

export default TestCommand;
