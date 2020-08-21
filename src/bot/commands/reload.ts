import { Command } from "discord-akairo";
import { Message } from "discord.js";

class ReloadCommand extends Command {
  constructor() {
    super("reload", {
      aliases: ["reload", "refresh"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    const msg: Message = await message.channel.send("Reloading...");
    this.client.listenerHandler?.reloadAll();
    this.client.inhibitorHandler?.reloadAll();
    this.client.commandHandler?.reloadAll();
    await msg.edit("Done.");
  }
}

export default ReloadCommand;
