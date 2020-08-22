import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { restart } from "../../../lib/admin";

class RestartCommand extends Command {
  constructor() {
    super("restart", {
      aliases: ["restart"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    restart.call(this, message);
  }
}

export default RestartCommand;
