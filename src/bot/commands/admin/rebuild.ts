import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { rebuild } from "../../../lib/admin";

interface IRebuildArgs {
  full?: boolean;
}

class RebuildCommand extends Command {
  constructor() {
    super("rebuild", {
      aliases: ["rebuild"],
      description: {
        content:
          "Recompile the bot's source code, optionally fully updating and restarting.",
        usage: "[--full|-F]",
      },
      category: "admin",
      ownerOnly: true,
      args: [
        {
          id: "full",
          match: "flag",
          flag: ["--full", "-F"],
        },
      ],
    });
  }
  async exec(message: Message, args: IRebuildArgs) {
    await rebuild.call(this, message, args);
  }
}

export default RebuildCommand;
