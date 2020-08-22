import { execAsync } from "../../../lib/proc";
import { InterpreterDef, InterpreterResult } from "../../../lib/interpret";
import { Message } from "discord.js";
import Path from "path";
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
    let ret: InterpreterResult;
    if (buildRes.error != null) {
      ret = {
        hadError: true,
        runtime: Date.now() - _s,
        output: buildRes.stderr.replace(new RegExp(fpath, "g"), fileName),
        fileName,
      };
    } else {
      _s = Date.now();
      const res = await execAsync(`${cargoPath} run`, {
        cwd: fpath,
        timeout: 5000,
      });
      if (res.error != null) {
        ret = {
          hadError: true,
          runtime: Date.now() - _s,
          output: res.stderr.replace(new RegExp(fpath, "g"), fileName),
          fileName,
        };
      } else {
        ret = {
          hadError: false,
          runtime: Date.now() - _s,
          output: res.stdout,
          fileName,
        };
      }
    }
    await execAsync(`rm -r ${fpath}`, { cwd: process.cwd() });
    return ret;
  },
};

export default rustInterpreter;
