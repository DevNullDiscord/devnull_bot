import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface SubredditCommandArgs {
  match: RegExpMatchArray | null;
}
class SubredditCommand extends Command {
  constructor() {
    super("subreddit", {
      regex: /(?<!reddit.com\/)\b(r\/[a-z0-9_]+)\b/i,
      category: "regex",
    });
  }
  exec(message: Message, { match }: SubredditCommandArgs) {
    if (match === null) {
      return;
    }

    message.reply("Fuck u/spez");
  }
}

export default SubredditCommand;
