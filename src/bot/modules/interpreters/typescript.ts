import axios, { AxiosResponse } from "axios";
import {
  InterpreterDef,
  InterpreterResult,
  WebberResponse,
  WebberException,
} from "../../../lib/interpret";

interface WebberDenoResponse extends WebberResponse {
  eval?: InterpreterResult;
  error?: string;
}

const tsInterpreter: InterpreterDef = {
  langID: "ts",
  extension: ".ts",
  interpret(filename, source): Promise<InterpreterResult> {
    return new Promise(async (resolve, reject) => {
      const res: AxiosResponse<WebberDenoResponse> = await axios.post(
        "https://webber.envis10n.dev/api/v1/deno",
        { id: filename, source, language: "ts" },
      );
      if (res.data.error != undefined) {
        reject(new WebberException(res.data.error));
      } else if (res.data.eval != undefined) {
        resolve(res.data.eval);
      }
    });
  },
};

export default tsInterpreter;
