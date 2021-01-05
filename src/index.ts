import { config } from "dotenv";
config();

import { discordToken, interpreterDir } from "./config";
import client from "./client";
import fs from "fs-extra";
import * as storage from "./storage";
import { adminRepl } from "./lib/admin";

async function main(): Promise<void> {
  await fs.ensureDir(interpreterDir);
  await storage.loadStorage();
  console.log("Storage system loaded.");
  storageLoop();
  await client.login(discordToken);
  adminRepl.context["_discord"] = client;
}

async function storageLoop() {
  setTimeout(() => {
    storage.saveStorage().then(() => {
      storageLoop();
    });
  }, 30000);
}

process.on("exit", () => {
  console.log("Saving storage...");
  storage.saveSync();
  console.log("Done.");
});
process.on("SIGINT", () => process.exit(0));
process.on("SIGUSR1", () => process.exit(0));
process.on("SIGUSR2", () => process.exit(0));
process.on("uncaughtException", () => process.exit(1));

console.log("Starting up...");
main();
