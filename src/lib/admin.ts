import fs from "fs-extra";
import { Command } from "discord-akairo";
import Path from "path";
import { Message } from "discord.js";
import { execAsync } from "./proc";
import { cmdPrefix } from "../config";

const restartFile = Path.resolve(process.cwd(), ".restart");
const bugPath = Path.resolve(process.cwd(), cmdPrefix);

let _bState: boolean = false;

interface IRebuildArgs {
  full?: boolean;
}

export async function rebuild(
  this: Command,
  message: Message,
  args: IRebuildArgs,
) {
  if (_bState) {
    message.reply("Unable to comply.");
    return;
  }
  _bState = true;
  if (args.full == true) {
    await update.call(this, message);
  }
  const msg: Message = await message.channel.send("Rebuilding...");
  try {
    const res = await execAsync("npm run build", { cwd: process.cwd() });
    if (res.error != null)
      await msg.edit(`Build error.\`\`\`\n${res.stdout}\n\`\`\``);
    else {
      await msg.edit("Rebuilding...\nDone.");
      if (args.full == true) {
        restart.call(this, message);
      }
    }
  } catch (e) {
    await msg.edit(`Error\`\`\`\n${e.message}\n\`\`\``);
  }
  if (await fs.pathExists(bugPath)) {
    await fs.rmdir(bugPath);
  }
  _bState = false;
}

export async function restart(this: Command, message: Message) {
  if (_bState) {
    message.reply("Unable to comply.");
    return;
  }
  _bState = true;
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
  if (_bState) {
    message.reply("Unable to comply.");
    return;
  }
  _bState = true;
  const msg: Message = await message.channel.send("Reloading...");
  this.client.listenerHandler?.reloadAll();
  this.client.inhibitorHandler?.reloadAll();
  this.client.commandHandler?.reloadAll();
  await msg.edit("Reloading...\nDone.");
  _bState = false;
}

export async function update(this: Command, message: Message) {
  if (_bState) {
    message.reply("Unable to comply.");
    return;
  }
  _bState = true;
  const msg: Message = await message.channel.send("Updating...");
  try {
    const res = await execAsync("git pull", { cwd: process.cwd() });
    if (res.error != null)
      await msg.edit(`\`\`\`\n${res.stderr}\n${res.stdout}\n\`\`\``);
    else await msg.edit("Updating...\nDone.");
  } catch (e) {
    await msg.edit(`Error\`\`\`\n${e.message}\n\`\`\``);
  }
  _bState = false;
}
