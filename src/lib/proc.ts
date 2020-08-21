import { exec, ExecOptions, ExecException } from "child_process";

interface IExecResult {
  error: ExecException | null;
  stdout: string;
  stderr: string;
}

export async function execAsync(
  command: string,
  options: ExecOptions,
): Promise<IExecResult> {
  return new Promise((resolve, reject) => {
    try {
      exec(command, options, (err, stdout, stderr) => {
        resolve({ error: err, stdout, stderr });
      });
    } catch (e) {
      reject(e);
    }
  });
}
