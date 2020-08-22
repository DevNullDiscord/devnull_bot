import { Message } from "discord.js";
import pidusage from "pidusage";
import fkill from "fkill";

export class WebberException extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export declare interface InterpreterResult {
  runtime: number;
  output: string;
  hadError: boolean;
  fileName: string;
}

export declare interface WebberResponse {
  ts: number;
  responseTime: number;
}

export declare interface InterpreterDef {
  langID: string;
  extension: string;
  interpret(message: Message, source: string): Promise<InterpreterResult>;
}

export declare interface InterpreterProcess {
  pid: number;
  alive: boolean;
}

export const processes: Map<string, InterpreterProcess> = new Map();

function interval() {
  setTimeout(() => {
    (async () => {
      const dead: string[] = [];
      for (const key of processes.keys()) {
        const proc = processes.get(key);
        if (proc == undefined) return;
        try {
          const res = await pidusage(proc.pid);
          if (!proc.alive) {
            console.log(
              `Process ${proc.pid} is marked as dead, but is still running.`,
            );
            await fkill(proc.pid);
            console.log(`Process ${proc.pid} forcefully killed.`);
          } else {
            if (res.memory >= 150 * 1024 * 1024) {
              // Too much memory, kill it
              console.log(
                `Process ${proc.pid} using too much memory. (${(
                  res.memory /
                  1024 /
                  1024
                ).toFixed(2)} mb)`,
              );
              await fkill(proc.pid);
              console.log(`Process ${proc.pid} forcefully killed.`);
            }
          }
        } catch (e) {
          // Can't get process info, remove it.
          dead.push(key);
        }
      }
      dead.forEach((k) => {
        processes.delete(k);
      });
    })().then(() => {
      interval();
    });
  }, 1000);
}
interval();
