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

function shutdown() {
  console.log("Saving storage...");
  storage.saveSync();
  console.log("Done.");
}

process.on("exit", shutdown);
process.on("beforeExit", shutdown);
process.on("SIGINT", shutdown); // CTRL+C
process.on("SIGUSR1", shutdown); // Kill PID
process.on("SIGUSR2", shutdown); // Kill PID
process.on("uncaughtException", shutdown);

console.log("Starting up...");
main();
