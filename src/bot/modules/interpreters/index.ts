import { InterpreterDef } from "../../../lib/interpret";
import js from "./javascript";
import ts from "./typescript";
import rs from "./rust";

const interpreters: { [key: string]: InterpreterDef } = {
  js,
  ts,
  rs,
};

export default interpreters;
