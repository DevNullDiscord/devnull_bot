import { Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";
import * as storage from "../../../storage";

class AvatarCommand extends Command {
  constructor() {
    super("avichange", {
      aliases: ["avichange"],
      description: {
        content:
          "Get how many times a user has changed  their avatar (since being tracked).",
        usage: "[user]",
      },
      category: "fun",
      args: [
        {
          id: "user",
          type: "member",
          default: null,
        },
      ],
    });
  }
  async exec(message: Message, args: { user: GuildMember | null }) {
    if (args.user == null)
      return await message.util?.reply(
        "please mention the user you would like to get data about.",
      );
    const col = storage.getCollection<IUserData>("user-avatar-changes");
    const id = args.user.id;
    if (col[id] == undefined) col[id] = { updates: [] };
    const count = col[id].updates.length;
    const last = col[id].updates[count - 1];
    return await message.util?.reply(
      `user has changed avatars ${count} time(s) since I started tracking.\n*Last updated: ${
        count > 0 ? new Date(last.timestamp).toUTCString() : "Never"
      }*`,
    );
  }
}

export default AvatarCommand;
