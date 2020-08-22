import { InterpreterDef, InterpreterResult } from "../../../lib/interpret";
import { denoEval } from "../../../lib/deno";
import { interpreterDir } from "../../../config";
import Path from "path";
import fs from "fs-extra";

const tsDir = Path.resolve(interpreterDir, "ts");

fs.ensureDirSync(tsDir);

const tsInterpreter: InterpreterDef = {
  langID: "ts",
  extension: ".ts",
  async interpret(message, source): Promise<InterpreterResult> {
    const fPath = Path.resolve(tsDir, message.author.id + ".ts");
    return await denoEval("ts", source, message.author.id, fPath);
  },
};

export default tsInterpreter;
