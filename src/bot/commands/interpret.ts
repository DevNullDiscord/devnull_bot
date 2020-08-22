import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import interpreters from "../modules/interpreters";

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

class InterpreterCommand extends Command {
  constructor() {
    super("interpret", {
      aliases: ["interpret", "eval"],
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
      const interp = interpreters[block.language];
      if (interp != undefined) {
        const filename: string = `${message.author.id}${interp.extension}`;
        const emb: MessageEmbed = new MessageEmbed();
        emb.setTitle(filename);
        emb.addField("Status", "Running");
        const msg = await message.channel.send(emb);
        try {
          const res = await interp.interpret(message.author.id, block.source);
          emb.setColor(res.hadError ? 0xff0000 : 0x00ff00);
          emb.fields[0].value = "Complete";
          const out = trimForDiscord(res.output.replace(/`/g, "`​"), 1992);
          emb.setDescription(`\`\`\`\n${out}\n\`\`\``);
          await msg.edit(emb);
        } catch (e) {
          emb.setColor(0xff0000);
          const m = trimForDiscord(e.toString(), 1992);
          emb.setDescription(`\`\`\`\n${m.replace(/`/g, "`​")}\n\`\`\``);
          emb.fields[0].value = "Failed";
          await msg.edit(emb);
        }
      } else {
        message.reply(
          "Unsupported language detected.\nIf you want to see this language implemented: file an issue, submit a PR, or ask someone to do it!",
        );
      }
    } else {
      message.reply(
        "No valid codeblock found.\nGeneric codeblocks (no syntax coloring) are not supported.",
      );
    }
  }
}

export default InterpreterCommand;
