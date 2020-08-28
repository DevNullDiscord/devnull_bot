import { Command } from "discord-akairo";
import { Message } from "discord.js";
import * as rand from "../../../lib/rand";

interface DiceArguments {
  num1: number;
  num2: number | null;
}

class DiceCommand extends Command {
  constructor() {
    super("dice", {
      aliases: ["dice", "roll"],
      description: {
        content: "Roll the dice.",
        usage: "<max>, <min> <max>",
      },
      category: "fun",
      args: [
        {
          id: "num1",
          type: "number",
          default: 100,
        },
        {
          id: "num2",
          type: "number",
          default: null,
        },
      ],
    });
  }
  async exec(message: Message, args: DiceArguments): Promise<Message> {
    const nums: number[] = [args.num1, args.num2 == null ? 0 : args.num2];
    nums.sort((a, b) => a - b);
    let res = await rand.srandInRange(nums[1], nums[0]);
    res = Math.round(res);
    return message.util!.reply(`rolled \`${res}\`! *(${nums[0]}-${nums[1]})*`);
  }
}

export default DiceCommand;
