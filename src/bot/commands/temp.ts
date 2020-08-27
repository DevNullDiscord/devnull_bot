import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

interface TempArgs {
  match: RegExpMatchArray | null;
}

interface TempConverter {
  c(temp: number): number;
  f(temp: number): number;
}

const converters: { [key: string]: TempConverter } = {};

converters["c"] = {
  c: (temp) => temp,
  f: CelciusToFarenheit,
};

converters["f"] = {
  c: FarenheitToCelcius,
  f: (temp) => temp,
};

function CelciusToFarenheit(temp: number): number {
  return (9 / 5) * temp + 32;
}

function FarenheitToCelcius(temp: number): number {
  return (temp - 32) / (9 / 5);
}

class TempCommand extends Command {
  constructor() {
    super("temp", {
      regex: /(\d+(?:\.\d+)?) ?(?:degrees )?(celcius|fahrenheit|c|f)/i,
      cooldown: 10000,
      ratelimit: 2,
    });
  }
  async exec(message: Message, args: TempArgs) {
    if (args.match != null) {
      const mTemp: string = args.match[1];
      const mType: string = args.match[2].substring(0, 1).toLowerCase();
      const tVal: number = parseFloat(mTemp);
      if (isNaN(tVal) || !isFinite(tVal)) return;
      const converter: TempConverter = converters[mType];
      let reply: string = "";
      let fix: number = 2;
      let v: number;
      switch (mType) {
        case "c":
          v = converter.f(tVal);
          if (v % 1 == 0) fix = 0;
          reply = `\`${v.toFixed(fix)}F\``;
          break;
        case "f":
          v = converter.c(tVal);
          if (v % 1 == 0) fix = 0;
          reply = `\`${v.toFixed(fix)}C\``;
          break;
      }
      await message.channel.send(reply);
    }
  }
}

export default TempCommand;
