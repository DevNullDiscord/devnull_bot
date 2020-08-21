import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { execAsync } from "../../../lib/proc";

class UpdateCommand extends Command {
  constructor() {
    super("update", {
      aliases: ["update"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    const msg: Message = await message.channel.send("Updating...");
    try {
      const res = await execAsync("git pull", { cwd: process.cwd() });
      if (res.error != null)
        await msg.edit(`\`\`\`\n${res.stderr}\n${res.stdout}\n\`\`\``);
      else await msg.edit("Done.");
    } catch (e) {
      await msg.edit(`Error\`\`\`\n${e.message}\n\`\`\``);
    }
  }
}

export default UpdateCommand;
