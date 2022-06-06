import { Command } from "discord-akairo";
import { Message } from "discord.js";
import axios, { AxiosResponse } from "axios";
import { twitterAPIKey } from "../../../config";

const api = axios.create({
  baseURL: "https://api.twitter.com/2",
  headers: { Authorization: `Bearer ${twitterAPIKey}` },
});

interface TwitterUserRes {
  data: {
    id: string;
    name: string;
    username: string;
  };
}

interface TwitterTweetRes {
  data: { id: string; text: string }[];
}

class TwitterCommand extends Command {
  constructor() {
    super("twitter", {
      aliases: ["twitter", "tweet", "twit"],
      description: {
        content: "Retrieve the 5 most recent tweets from a provided user.",
        usage: "<username>",
      },
      args: [
        {
          id: "username",
          type: "string",
          match: "text",
          default: null,
        },
      ],
      ownerOnly: true,
      category: "util",
      ratelimit: 1,
      cooldown: 600000,
    });
  }

  async exec(
    message: Message,
    { username }: { username: string },
  ): Promise<void> {
    const res = await api.get<any, AxiosResponse<TwitterUserRes>>(
      `/users/by/username/${username}`,
    );
    if (res.status != 200) {
      message.reply("An error occurred: " + res.status);
    } else {
      const uid = res.data.data.id;
      const res2 = await api.get<any, AxiosResponse<TwitterTweetRes>>(
        `/users/${uid}/tweets?max_results=5`,
      );
      if (res2.status != 200) {
        message.reply("An error occurred: " + res2.status);
      } else {
        const tweetcount = res2.data.data.length;
        const tweets = res2.data.data
          .map(
            (v) =>
              `https://twitter.com/${res.data.data.username}/status/${v.id}`,
          )
          .join("\n\n");
        message.reply(`Showing ${tweetcount} tweet(s) \n\n${tweets}`);
      }
    }
  }
}

export default TwitterCommand;
