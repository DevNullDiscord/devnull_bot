import Path from "path";
import fs from "fs-extra";
import { interpreterDir } from "../../../config";
import js from "./javascript";
import ts from "./typescript";
import rs from "./rust";

export function ensureInterpreterDir(language: string) {
  fs.ensureDirSync(Path.resolve(interpreterDir, language));
}

const interpreters: { [key: string]: InterpreterDef } = {
  js,
  ts,
  rs,
};

export default interpreters;
