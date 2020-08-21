import { config } from "dotenv";
config();

import { discordToken } from "./config";
import client from "./client";
import storage from "./storage";

async function main(): Promise<void> {
  await client.login(discordToken);
}

console.log("Starting up...");
main();
