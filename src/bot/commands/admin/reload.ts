import { cmdPrefix, ownerID } from "../../../config";
import {
  Command,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import Path from "path";
import { Message } from "discord.js";

class ReloadCommand extends Command {
  constructor() {
    super("reload", {
      aliases: ["reload"],
      ownerOnly: true,
    });
  }
  async exec(message: Message) {
    const msg: Message = await message.channel.send("Reloading...");
    this.client.commandHandler = new CommandHandler(this.client, {
      directory: Path.resolve(__dirname, "../../../bot/commands/"),
      prefix: cmdPrefix,
      defaultCooldown: 1000,
      allowMention: true,
      ignoreCooldown: ownerID,
      ignorePermissions: ownerID,
    });
    this.client.listenerHandler = new ListenerHandler(this.client, {
      directory: Path.resolve(__dirname, "../../../bot/listeners/"),
    });
    this.client.inhibitorHandler = new InhibitorHandler(this.client, {
      directory: Path.resolve(__dirname, "../../../bot/inhibitors/"),
    });
    this.client.commandHandler.useListenerHandler(this.client.listenerHandler);
    this.client.commandHandler.useInhibitorHandler(
      this.client.inhibitorHandler,
    );
    this.client.listenerHandler.loadAll();
    this.client.inhibitorHandler.loadAll();
    this.client.commandHandler.loadAll();
    await msg.edit("Done.");
  }
}

export default ReloadCommand;
