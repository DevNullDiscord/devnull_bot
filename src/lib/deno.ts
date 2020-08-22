import { exec, execSync } from "child_process";
import stripAnsi from "strip-ansi";
import fs, { existsSync } from "fs";
import { processes } from "../lib/interpret";

interface IDenoResult {
  runtime: number;
  output: string;
  hadError: boolean;
  fileName: string;
}

export async function denoEval(
  lang: "ts" | "js",
  code: string,
  id: string,
  fPath: string,
): Promise<IDenoResult> {
  return await new Promise((resolve, reject) => {
    const fExt = lang;
    if (existsSync(fPath)) reject("Script already running.");
    else {
      const _start = Date.now();
      const reg = /import.+from.+/g;
      const src = `const __programStart = ${_start};\nconst __canRun = () => Date.now() - __programStart <= 4900;${code
        .replace(reg, "")
        .trim()}`;
      fs.writeFileSync(fPath, src);
      const { pid } = exec(
        `deno run --quiet --no-remote ${fPath}`,
        { timeout: 5000 },
        (err, stdout, stderr) => {
          const proc = processes.get(id);
          if (proc != undefined) {
            proc.alive = false;
          }
          const runtime = Date.now() - _start;
          fs.unlinkSync(fPath);
          let output = "";
          let hadError = false;
          if (err) {
            hadError = true;
            try {
              if (err.killed) {
                output = "error: Script timed out.";
              } else if (stderr.trim().length > 0) {
                const s = stripAnsi(stderr.trim()).replace(
                  new RegExp(fPath.replace(/\\/g, "/"), "g"),
                  `_${id}.${fExt}`,
                );
                let s1 = s.split("\n");
                if (s1[0].startsWith("Check file")) s1 = s1.slice(1);
                if (s1.length == 0) output = err.toString();
                else {
                  let s2 = s1[0];
                  if (s1.length > 2) s2 = s1.join("\n");
                  if (s2 == undefined) output = s;
                  else output = s2;
                }
              } else {
                output = err.message;
              }
            } catch (e) {
              reject(e);
            }
          } else {
            output = stripAnsi(stdout.trim());
          }
          resolve({
            output,
            hadError,
            runtime,
            fileName: `_${id}.${fExt}`,
          });
        },
      );
      processes.set(id, {
        alive: true,
        pid,
      });
    }
  });
}
