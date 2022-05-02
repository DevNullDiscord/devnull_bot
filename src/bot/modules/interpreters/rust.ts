import { execAsync } from "../../../lib/proc";
import { exec, ExecException, ExecOptions } from "child_process";
import {
  InterpreterDef,
  InterpreterResult,
  processes,
} from "../../../lib/interpret";
import { Message } from "discord.js";
import Path from "path";
import fs from "fs-extra";
import { interpreterDir, cargoPath } from "../../../config";

export interface ExecError {
  err: ExecException;
  stdout: string;
  stderr: string;
}

const execPromise: (
  command: string,
  options: ExecOptions,
) => Promise<{ pid: number; stdout: string }> = (command) =>
  new Promise((resolve, reject) => {
    const { pid } = exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject({ err, stdout, stderr } as ExecError);
      }
      resolve({ pid, stdout });
    });
  });

const cargoToml = `[package]
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

    let res: InterpreterResult;
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
      res = {
        hadError: true,
        runtime: Date.now() - _s,
        output: buildRes.stderr.replace(new RegExp(fpath, "g"), fileName),
        fileName,
      };
    } else {
      _s = Date.now();
      let pid = 0;
      try {
        const result = await execPromise(`${cargoPath} run`, {
          cwd: fpath,
          timeout: 5000,
        });
        pid = result.pid;
        const proc = processes.get(message.author.id);
        if (proc != undefined) {
          proc.alive = false;
        }
        res = {
          hadError: false,
          runtime: Date.now() - _s,
          output: result.stdout,
          fileName,
        };
      } catch (reason) {
        res = {
          hadError: true,
          runtime: Date.now() - _s,
          output: (reason as unknown as ExecError).stderr.replace(
            new RegExp(fpath, "g"),
            fileName,
          ),
          fileName,
        };
      }
      processes.set(message.author.id, { pid, alive: true });
    }
    await fs.remove(fpath);
    return res;
  },
};

export default rustInterpreter;
