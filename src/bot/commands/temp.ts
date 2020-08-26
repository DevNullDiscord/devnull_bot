import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

interface TempArguments {
  temp: number | null;
  type: string;
}

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

class TempCommand extends Command {
  constructor() {
    super("temp", {
      aliases: ["temp"],
      args: [
        {
          id: "temp",
          type: "number",
        },
        {
          id: "type",
          type: "string",
          default: "c",
          match: "restContent",
        },
      ],
    });
  }

  exec(message: Message, args: TempArguments) {
    if (args.temp == null) {
      message.reply(
        "Please provide a temperature value.\nUsage: `temp [temp] <c|f|k>`",
      );
    } else {
      let c: number;
      let f: number;
      let k: number;
      let degree: string = "°";
      const emb: MessageEmbed = new MessageEmbed();
      emb.setTitle("Temperature Conversion");
      switch (args.type.toLowerCase()) {
        case "c":
          // celcius
          c = args.temp;
          f = CelciusToFarenheit(c);
          k = CelciusToKelvin(c);
          emb.addField("Celcius", `${c.toFixed(2)}${degree}C`);
          emb.addField("Farenheit", `${f.toFixed(2)}${degree}F`);
          emb.addField("Kelvin", `${k}${degree}K`);
          break;
        case "f":
          // farenheit
          f = args.temp;
          c = FarenheitToCelcius(f);
          k = FarenheitToKelvin(f);
          emb.addField("Farenheit", `${f.toFixed(2)}${degree}F`);
          emb.addField("Celcius", `${c.toFixed(2)}${degree}C`);
          emb.addField("Kelvin", `${k}${degree}K`);
          break;
        case "k":
          // kelvin
          k = args.temp;
          c = KelvinToCelcius(k);
          f = KelvinToFarenheit(k);
          emb.addField("Kelvin", `${k}${degree}K`);
          emb.addField("Celcius", `${c.toFixed(2)}${degree}C`);
          emb.addField("Farenheit", `${f.toFixed(2)}${degree}F`);
          break;
      }
      message.reply(emb);
    }
  }
}

export default TempCommand;
