import { config } from "dotenv";
config();

import { discordToken, interpreterDir } from "./config";
import client from "./client";
import fs from "fs-extra";
import storage from "./storage";

async function main(): Promise<void> {
  await fs.ensureDir(interpreterDir);
  await client.login(discordToken);
}

console.log("Starting up...");
main();
