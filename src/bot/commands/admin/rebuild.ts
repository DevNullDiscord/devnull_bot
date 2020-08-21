import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { execAsync } from "../../../lib/proc";
import { rebuild } from "../../../lib/admin";

interface IRebuildArgs {
  full?: boolean;
}

class RebuildCommand extends Command {
  constructor() {
    super("rebuild", {
      aliases: ["rebuild"],
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
