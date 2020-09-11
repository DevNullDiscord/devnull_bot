import Path from "path";
import fs from "fs-extra";
import Discord from "discord.js";
import { dataPath } from "./config";

if (!fs.existsSync(dataPath)) {
  fs.ensureDirSync(dataPath);
}

let storageLock: boolean = false;

const storage: { [key: string]: any } = {};

export async function storageWait() {
  return new Promise((resolve, reject) => {
    while (storageLock) {}
    resolve();
  });
}

export async function loadStorage() {
  await storageWait();
  storageLock = true;
  for (const fname of await fs.readdir(dataPath)) {
    const fpath = Path.resolve(dataPath, fname);
    const finfo = Path.parse(fpath);
    const fdata = await fs.readFile(fpath);
    storage[finfo.name] = JSON.parse(fdata.toString());
  }
  storageLock = false;
}

export async function saveStorage() {
  await storageWait();
  storageLock = true;
  for (const key in storage) {
    const fpath = Path.resolve(dataPath, `${key}.json`);
    const fdata = JSON.stringify(storage[key]);
    await fs.writeFile(fpath, fdata);
  }
  storageLock = false;
}

/**
 * Only use during shutdown! Will lock storage.
 */
export function saveSync() {
  while (storageLock) {}
  storageLock = true;
  for (const key in storage) {
    const fpath = Path.resolve(dataPath, `${key}.json`);
    const fdata = JSON.stringify(storage[key]);
    fs.writeFileSync(fpath, fdata);
  }
}

export function getCollection<T>(name: string): { [key: string]: T } {
  if (storage[name] == undefined) storage[name] = {};
  return storage[name] as { [key: string]: T };
}
