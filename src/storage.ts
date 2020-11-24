import Path from "path";
import fs from "fs-extra";
import { dataPath } from "./config";

if (!fs.existsSync(dataPath)) {
  fs.ensureDirSync(dataPath);
}

const storage: { [key: string]: unknown } = {};

export async function loadStorage() {
  for (const fname of await fs.readdir(dataPath)) {
    const fpath = Path.resolve(dataPath, fname);
    const finfo = Path.parse(fpath);
    const fdata = await fs.readFile(fpath);
    storage[finfo.name] = JSON.parse(fdata.toString());
  }
}

export async function saveStorage() {
  for (const key of Object.keys(storage)) {
    const fpath = Path.resolve(dataPath, `${key}.json`);
    const fdata = JSON.stringify(storage[key]);
    await fs.writeFile(fpath, fdata);
  }
}

/**
 * Only use during shutdown!
 */
export function saveSync() {
  for (const key of Object.keys(storage)) {
    const fpath = Path.resolve(dataPath, `${key}.json`);
    const fdata = JSON.stringify(storage[key]);
    fs.writeFileSync(fpath, fdata);
  }
}

export function getCollection<T>(name: string): { [key: string]: T } {
  if (storage[name] === undefined) storage[name] = {};
  return storage[name] as { [key: string]: T };
}
