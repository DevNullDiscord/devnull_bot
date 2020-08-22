import { Command } from "discord-akairo";
import { Message } from "discord.js";

import interpreters from "../modules/interpreters";

class InterpreterCommand extends Command {
  constructor() {
    super("interpret", {
      aliases: ["interpret", "eval"],
    });
  }
  async exec(message: Message) {
    // TODO: Handle interpreting code blocks.
  }
}

export default InterpreterCommand;
