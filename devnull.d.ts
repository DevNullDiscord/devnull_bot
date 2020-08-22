declare class WebberException extends Error {
  constructor(message?: string) {
    super(message);
  }
}

declare interface InterpreterResult {
  runtime: number;
  output: string;
  hadError: boolean;
  fileName: string;
}

declare interface WebberResponse {
  ts: number;
  responseTime: number;
}

declare interface InterpreterDef {
  langID: string;
  extension: string;
  interpret(filename: string, source: string): Promise<InterpreterResult>;
}
