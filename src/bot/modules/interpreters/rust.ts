import { execAsync } from "../../../lib/proc";
import { ensureInterpreterDir } from "./";
import Path from "path";
import fs from "fs-extra";
import { interpreterDir } from "../../../config";

let cargoToml: string = `[package]
name = "{packageName}"
version = "0.1.0"
authors = ["{authorName}"]
edition = "2018"

[dependencies]`;

ensureInterpreterDir("rs");

const rustInterpreter: InterpreterDef = {
  langID: "rs",
  extension: ".rs",
  async interpret(
    filename: string,
    source: string,
  ): Promise<InterpreterResult> {
    const fpath = Path.resolve(interpreterDir, "rs", filename);
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
        .replace("{packageName}", filename)
        .replace("{authorName}", filename),
    );
    await fs.writeFile(fmain, source);
    let _s = Date.now();
    const buildRes = await execAsync("cargo build", { cwd: fpath });
    if (buildRes.error != null) {
      return {
        hadError: true,
        runtime: Date.now() - _s,
        output: buildRes.stderr,
        fileName: filename + this.extension,
      };
    } else {
      _s = Date.now();
      const res = await execAsync("cargo run", { cwd: fpath, timeout: 5000 });
      if (res.error != null) {
        return {
          hadError: true,
          runtime: Date.now() - _s,
          output: res.stderr,
          fileName: filename + this.extension,
        };
      } else {
        return {
          hadError: false,
          runtime: Date.now() - _s,
          output: res.stdout,
          fileName: filename + this.extension,
        };
      }
    }
  },
};

export default rustInterpreter;
