import { execAsync } from "../../../lib/proc";
import { exec } from "child_process";
import {
  InterpreterDef,
  InterpreterResult,
  processes,
} from "../../../lib/interpret";
import { Message } from "discord.js";
import Path, { resolve } from "path";
import fs from "fs-extra";
import { interpreterDir, cargoPath } from "../../../config";

let cargoToml: string = `[package]
name = "{packageName}"
version = "0.1.0"
authors = ["{authorName}"]
edition = "2018"

[dependencies]`;

fs.ensureDir(Path.resolve(interpreterDir, "rs"));

const rustInterpreter: InterpreterDef = {
  langID: "rs",
  extension: ".rs",
  async interpret(
    message: Message,
    source: string,
  ): Promise<InterpreterResult> {
    const fpath = Path.resolve(interpreterDir, "rs", message.author.id);
    const ctoml = Path.resolve(fpath, "Cargo.toml");
    const srcDir = Path.resolve(fpath, "src");
    const fmain = Path.resolve(srcDir, "main.rs");
    const res: InterpreterResult = await new Promise(
      async (resolve, reject) => {
        await fs.ensureDir(fpath);
        await fs.ensureDir(srcDir);
        await fs.ensureFile(ctoml);
        await fs.ensureFile(fmain);
        await fs.writeFile(
          ctoml,
          cargoToml
            .replace("{packageName}", `${message.author.username}_rs`)
            .replace("{authorName}", message.author.username),
        );
        await fs.writeFile(fmain, source);
        const fileName = `${message.author.username}_rs`;
        let _s = Date.now();
        const buildRes = await execAsync(`${cargoPath} build`, { cwd: fpath });
        if (buildRes.error != null) {
          resolve({
            hadError: true,
            runtime: Date.now() - _s,
            output: buildRes.stderr.replace(new RegExp(fpath, "g"), fileName),
            fileName,
          });
        } else {
          _s = Date.now();
          const { pid } = exec(
            `${cargoPath} run`,
            { cwd: fpath, timeout: 5000 },
            (err, stdout, stderr) => {
              const proc = processes.get(message.author.id);
              if (proc != undefined) {
                proc.alive = false;
              }
              if (err != null) {
                resolve({
                  hadError: true,
                  runtime: Date.now() - _s,
                  output: stderr.replace(new RegExp(fpath, "g"), fileName),
                  fileName,
                });
              } else {
                resolve({
                  hadError: false,
                  runtime: Date.now() - _s,
                  output: stdout,
                  fileName,
                });
              }
            },
          );
          processes.set(message.author.id, { pid, alive: true });
        }
      },
    );
    await fs.remove(fpath);
    return res;
  },
};

export default rustInterpreter;
