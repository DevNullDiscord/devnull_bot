import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { adminRepl } from "../../../lib/admin";

interface ICodeBlock {
  language: string;
  source: string;
}

function containsCodeblock(content: string): boolean {
  return /```\w\w\n?[\S\s]+```\n?/g.test(content);
}

function parseCodeblocks(content: string): ICodeBlock[] {
  const blocks: ICodeBlock[] = [];
  const mReg: RegExp = /```(\w\w)\n?/g;
  let match: RegExpExecArray | null = mReg.exec(content);
  while (match != null) {
    const s_off: number = match.index;
    const language: string = match[1];
    const e_off: number = content.indexOf("```", s_off + match[0].length);
    if (e_off != -1) {
      const source: string = content.substring(s_off + match[0].length, e_off);
      blocks.push({
        language,
        source,
      });
    }
    match = mReg.exec(content);
  }
  return blocks;
}

function trimForDiscord(input: string, max: number = 2000): string {
  if (input.length > max) input = input.substring(0, input.length - max);
  return input;
}

class ReplCommand extends Command {
  constructor() {
    super("repl", {
      aliases: ["repl"],
      description: {
        content: "Run the JS code block via the internal admin REPL.",
        usage: "<codeblock>",
      },
      category: "admin",
      ownerOnly: true,
      args: [
        {
          id: "content",
          type: "string",
          match: "rest",
          default: "",
        },
      ],
    });
  }
  async exec(message: Message, args: { content: string }) {
    const blocks = parseCodeblocks(args.content);
    if (blocks.length > 0) {
      const block = blocks[0];
      if (block.language != "js")
        message.util?.reply("No valid codeblock found.");
      else {
        try {
          adminRepl.outputStream.once("data", (chunk) => {
            message.util?.reply(
              trimForDiscord(`\`\`\`\n${chunk.toString()}\n\`\`\``),
            );
          });
          adminRepl.inputStream.emit("data", Buffer.from(block.source));
        } catch (e) {
          console.error(e);
          message.util?.reply(trimForDiscord(`Error in REPL: ${e}`));
        }
      }
    } else {
      message.util?.reply("No valid codeblock found.");
    }
  }
}

export default ReplCommand;
