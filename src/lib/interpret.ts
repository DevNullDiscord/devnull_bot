import { Message } from "discord.js";

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
