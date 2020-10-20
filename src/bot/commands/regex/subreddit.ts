import { Command } from "discord-akairo";
import { Message } from "discord.js";

interface SubredditCommandArgs {
  match: RegExpMatchArray | null;
}
class SubredditCommand extends Command {
  constructor() {
    super("subreddit", {
      regex: /\b(r\/[a-z0-9_]+)\b/i,
      category: "regex",
    });
  }
  exec(message: Message, { match }: SubredditCommandArgs) {
    if (match === null) {
      return;
    }

    message.reply(`https://reddit.com/${match[0]}`);
  }
}

export default SubredditCommand;
