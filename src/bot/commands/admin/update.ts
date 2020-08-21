import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { execAsync } from "../../../lib/proc";
import { update } from "../../../lib/admin";

class UpdateCommand extends Command {
  constructor() {
    super("update", {
      aliases: ["update"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    await update.call(this, message);
  }
}

export default UpdateCommand;
