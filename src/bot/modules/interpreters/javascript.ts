import { InterpreterDef, InterpreterResult } from "../../../lib/interpret";
import { denoEval } from "../../../lib/deno";
import { interpreterDir } from "../../../config";
import Path from "path";
import fs from "fs-extra";

const jsDir = Path.resolve(interpreterDir, "js");

fs.ensureDirSync(jsDir);

const jsInterpreter: InterpreterDef = {
  langID: "js",
  extension: ".js",
  async interpret(message, source): Promise<InterpreterResult> {
    const fPath = Path.resolve(jsDir, message.author.id + ".js");
    return await denoEval("js", source, message.author.id, fPath);
  },
};

export default jsInterpreter;
