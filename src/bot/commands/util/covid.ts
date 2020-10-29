import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { getStateRecent } from "../../../lib/covid";

class CovidCommand extends Command {
  constructor() {
    super("covid", {
      aliases: ["covid", "coronavirus"],
      description: {
        content:
          "Get state summaries for recent COVID activity. Powered by CovidActNow.org",
        usage: "<state>",
      },
      args: [
        {
          id: "state",
          type: "string",
          default: null,
        },
      ],
      category: "util",
      ratelimit: 1,
      cooldown: 15000,
    });
  }

  async exec(message: Message, args: { state: string | null }): Promise<void> {
    if (args.state == null) {
      message.reply("No state provided.");
      return;
    }
    const data = await getStateRecent(args.state);
    if (data == undefined) {
      message.reply("State provided invalid or unabled to be detected.");
      return;
    }
    // TODO: Format the data here into an embed.
    message.reply(
      `Covid statistics for ${data.state}:\n\`\`\`\n${JSON.stringify(
        data.metrics,
        null,
        2,
      )}\n\`\`\``,
    );
  }
}

export default CovidCommand;
