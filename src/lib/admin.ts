import { cmdPrefix, ownerID } from "../config";
import {
  Command,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import Path from "path";
import { Message } from "discord.js";
import { execAsync } from "./proc";

interface IRebuildArgs {
  full?: boolean;
}

export async function rebuild(
  this: Command,
  message: Message,
  args: IRebuildArgs,
) {
  if (args.full) {
    await update.call(this, message);
  }
  const msg: Message = await message.channel.send("Rebuilding...");
  try {
    await execAsync("rm -r build", { cwd: process.cwd() });
    await execAsync("rm .tsbuild", { cwd: process.cwd() });
    const res = await execAsync("npx tsc", { cwd: process.cwd() });
    if (res.error != null)
      await msg.edit(`Build error.\`\`\`\n${res.stdout}\n\`\`\``);
    else {
      await msg.edit("Rebuilding...\nDone.");
      if (args.full) {
        await reload.call(this, message);
      }
    }
  } catch (e) {
    await msg.edit(`Error\`\`\`\n${e.message}\n\`\`\``);
  }
}

export async function reload(this: Command, message: Message) {
  const msg: Message = await message.channel.send("Reloading...");
  this.client.commandHandler = new CommandHandler(this.client, {
    directory: Path.resolve(__dirname, "../bot/commands/"),
    prefix: cmdPrefix,
    defaultCooldown: 1000,
    allowMention: true,
    ignoreCooldown: ownerID,
    ignorePermissions: ownerID,
  });
  this.client.listenerHandler = new ListenerHandler(this.client, {
    directory: Path.resolve(__dirname, "../bot/listeners/"),
  });
  this.client.inhibitorHandler = new InhibitorHandler(this.client, {
    directory: Path.resolve(__dirname, "../bot/inhibitors/"),
  });
  this.client.commandHandler.useListenerHandler(this.client.listenerHandler);
  this.client.commandHandler.useInhibitorHandler(this.client.inhibitorHandler);
  this.client.listenerHandler.loadAll();
  this.client.inhibitorHandler.loadAll();
  this.client.commandHandler.loadAll();
  await msg.edit("Reloading...\nDone.");
}

export async function update(this: Command, message: Message) {
  const msg: Message = await message.channel.send("Updating...");
  try {
    const res = await execAsync("git pull", { cwd: process.cwd() });
    if (res.error != null)
      await msg.edit(`\`\`\`\n${res.stderr}\n${res.stdout}\n\`\`\``);
    else await msg.edit("Updating...\nDone.");
  } catch (e) {
    await msg.edit(`Error\`\`\`\n${e.message}\n\`\`\``);
  }
}
