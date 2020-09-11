import { config } from "dotenv";
config();

import { discordToken, interpreterDir } from "./config";
import client from "./client";
import fs from "fs-extra";
import * as storage from "./storage";

async function main(): Promise<void> {
  await fs.ensureDir(interpreterDir);
  await storage.loadStorage();
  console.log("Storage system loaded.");
  storageLoop();
  await client.login(discordToken);
}

async function storageLoop() {
  setTimeout(() => {
    storage.saveStorage().then(() => {
      storageLoop();
    });
  }, 30000);
}

function storageShutdown() {
  console.log("Saving storage...");
  storage.saveSync();
  console.log("Done.");
}

process.on("SIGINT", () => {
  storageShutdown();
  process.exit(0);
});

console.log("Starting up...");
main();
