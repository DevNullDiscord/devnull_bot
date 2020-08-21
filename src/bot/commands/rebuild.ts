import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { execAsync } from "../../lib/proc";

class RebuildCommand extends Command {
  constructor() {
    super("rebuild", {
      aliases: ["rebuild"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    const msg: Message = await message.channel.send("Rebuilding...");
    try {
      const res = await execAsync("npx tsc", { cwd: process.cwd() });
      if (res.error != null)
        await msg.edit(`Build error.\`\`\`\n${res.stdout}\n\`\`\``);
      else await msg.edit("Done.");
    } catch (e) {
      await msg.edit(`Error\`\`\`\n${e.message}\n\`\`\``);
    }
  }
}

export default RebuildCommand;
