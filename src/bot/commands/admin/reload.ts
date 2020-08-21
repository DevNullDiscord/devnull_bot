import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { reload } from "../../../lib/admin";

class ReloadCommand extends Command {
  constructor() {
    super("reload", {
      aliases: ["reload"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    await reload.call(this, message);
  }
}

export default ReloadCommand;
