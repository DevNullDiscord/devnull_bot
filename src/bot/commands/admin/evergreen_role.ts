import { Command } from "discord-akairo";
import { Message, Role } from "discord.js";
import * as storage from "../../../storage";
import * as evergreen from "../../../lib/evergreen";

interface IEvergreenArgs {
  role: Role,
}

class EvergreenInitCommand extends Command {
  constructor() {
    super("setevergreenrole", {
      aliases: ["setevergreenrole"],
      description: {
        content: "Set evergreen monitoring role.",
      },
      args: [
        {
          id: "role",
          type: "role",
        }
      ],
      category: "admin",
      channel: "guild",
      ownerOnly: true,
    });
  }
  async exec(message: Message, args: IEvergreenArgs) {
    const estore = storage.getCollection<evergreen.IEvergreenMon>("evergreen-mon");
    if (estore["evergreen"] == undefined) {
      message.reply("Not currently monitoring in a channel.");
    } else {
      const edata = estore["evergreen"];
      edata.role_id = args.role.id;
      message.reply(`Role set to <@&${edata.role_id}>.`);
    }
  }
}

export default EvergreenInitCommand;
