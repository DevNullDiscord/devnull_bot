import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

interface TempArgs {
  match: RegExpMatchArray | null;
}

interface TempConverter {
  c(temp: number): number;
  f(temp: number): number;
  k(temp: number): number;
}

const converters: { [key: string]: TempConverter } = {};

converters["k"] = {
  c: KelvinToCelcius,
  f: KelvinToFarenheit,
  k: (temp) => temp,
};

converters["c"] = {
  c: (temp) => temp,
  f: CelciusToFarenheit,
  k: CelciusToKelvin,
};

converters["f"] = {
  c: FarenheitToCelcius,
  f: (temp) => temp,
  k: FarenheitToKelvin,
};

function KelvinToCelcius(temp: number): number {
  return temp - 273.15;
}

function CelciusToKelvin(temp: number): number {
  return temp + 273.15;
}

function KelvinToFarenheit(temp: number): number {
  return (9 / 5) * (temp - 273.15) + 32;
}

function FarenheitToKelvin(temp: number): number {
  return (5 / 9) * (temp - 32) + 273.15;
}

function CelciusToFarenheit(temp: number): number {
  return (9 / 5) * temp + 32;
}

function FarenheitToCelcius(temp: number): number {
  return (temp - 32) / (9 / 5);
}

let lastUse: number = 0;

class TempCommand extends Command {
  constructor() {
    super("temp", {
      regex: /(\d+\.?\d+?)([kcfKCF])/i,
    });
  }
  async exec(message: Message, args: TempArgs) {
    if (args.match != null) {
      if (Date.now() - lastUse < 10000) return;
      const mTemp: string = args.match[1];
      const mType: string = args.match[2].toLowerCase();
      const tVal: number = parseFloat(mTemp);
      if (isNaN(tVal) || !isFinite(tVal)) return;
      const converter: TempConverter = converters[mType];
      let reply: string = "";
      switch (mType) {
        case "c":
          reply = `${tVal.toFixed(2)} degrees Celcius: ${converter
            .f(tVal)
            .toFixed(2)} degrees Farenheit, ${converter
            .k(tVal)
            .toFixed(2)} Kelvin`;
          break;
        case "f":
          reply = `${tVal.toFixed(2)} degrees Farenheit: ${converter
            .c(tVal)
            .toFixed(2)} degrees Celcius, ${converter
            .k(tVal)
            .toFixed(2)} Kelvin`;
          break;
        case "k":
          reply = `${tVal.toFixed(2)} Kelvin: ${converter
            .f(tVal)
            .toFixed(2)} degrees Farenheit, ${converter
            .c(tVal)
            .toFixed(2)} degrees Celcius`;
          break;
      }
      await message.channel.send(reply);
      lastUse = Date.now();
    }
  }
}

export default TempCommand;
