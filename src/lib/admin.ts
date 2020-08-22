import { cmdPrefix, ownerID } from "../config";
import fs from "fs-extra";
import {
  Command,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import Path from "path";
import { Message } from "discord.js";
import { execAsync } from "./proc";

const buildDir = Path.resolve(process.cwd(), "build");
const restartFile = Path.resolve(process.cwd(), ".restart");

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
    await fs.remove(buildDir);
    await execAsync("npm install", { cwd: process.cwd() });
    const res = await execAsync("npx tsc", { cwd: process.cwd() });
    if (res.error != null)
      await msg.edit(`Build error.\`\`\`\n${res.stdout}\n\`\`\``);
    else {
      await msg.edit("Rebuilding...\nDone.");
      if (args.full) {
        restart.call(this, message);
      }
    }
  } catch (e) {
    await msg.edit(`Error\`\`\`\n${e.message}\n\`\`\``);
  }
}

export async function restart(this: Command, message: Message) {
  const msg = await message.channel.send("Restarting...");
  await fs.ensureFile(restartFile);
  await fs.writeFile(
    restartFile,
    JSON.stringify({
      guild: msg.guild?.id,
      message: msg.id,
      channel: msg.channel.id,
    }),
  );
  process.exit(0);
}

export async function reload(this: Command, message: Message) {
  const msg: Message = await message.channel.send("Reloading...");
  this.client.listenerHandler?.reloadAll();
  this.client.inhibitorHandler?.reloadAll();
  this.client.commandHandler?.reloadAll();
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
