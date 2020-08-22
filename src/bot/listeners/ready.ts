import { Listener } from "discord-akairo";
import Discord from "discord.js";
import fs from "fs-extra";
import Path from "path";

const restartFile = Path.resolve(process.cwd(), ".restart");

class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    });
  }
  async exec() {
    console.log(
      "Logged in as",
      `${this.client.user?.username}#${this.client.user?.discriminator}`,
    );
    if (fs.existsSync(restartFile)) {
      const restart: {
        guild: string | null;
        message: string;
        channel: string;
      } = JSON.parse(await fs.readFile(restartFile, { encoding: "utf-8" }));
      if (restart.guild) {
        const guild = await this.client.guilds.fetch(restart.guild);
        const messages = await (guild.channels.resolve(
          restart.channel,
        ) as Discord.TextChannel).messages.fetch();
        messages.get(restart.message)?.edit("Restarting...\nDone.");
      }
      await fs.remove(restartFile);
    }
  }
}

export default ReadyListener;
