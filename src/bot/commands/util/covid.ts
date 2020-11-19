import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { getStateRecent } from "../../../lib/covid";

function lerp(a: number, b: number, t: number = 0.5): number {
  t = t > 1 ? 1 : t < 0 ? 0 : t;
  return (1 - t) * a + t * b;
}

class CovidCommand extends Command {
  constructor() {
    super("covid", {
      aliases: ["covid", "coronavirus"],
      description: {
        content:
          "Get state summaries for recent COVID activity. Powered by CovidActNow.org",
        usage: "<state>",
      },
      args: [
        {
          id: "state",
          type: "string",
          default: null,
        },
      ],
      category: "util",
      ratelimit: 1,
      cooldown: 15000,
    });
  }

  async exec(message: Message, args: { state: string | null }): Promise<void> {
    if (args.state == null) {
      message.reply("No state provided.");
      return;
    }
    const data = await getStateRecent(args.state);
    if (data == undefined) {
      message.reply("State provided invalid or unabled to be detected.");
      return;
    }

    const posRatio = (data.metrics.testPositivityRatio * 100).toFixed(2);
    const cDensity = data.metrics.caseDensity.toFixed(2);
    const traceRatio = (data.metrics.contactTracerCapacityRatio * 100).toFixed(
      2,
    );
    const inRate = data.metrics.infectionRate.toFixed(2);
    const icuHeadroom = (data.metrics.icuHeadroomRatio * 100).toFixed(2);
    const icuPerTotal =
      data.metrics.icuHeadroomDetails.currentIcuCovid +
      data.metrics.icuHeadroomDetails.currentIcuNonCovid;
    const icuCovPer = (
      (data.metrics.icuHeadroomDetails.currentIcuCovid / icuPerTotal) *
      100
    ).toFixed(2);
    const icuNonCovPer = (
      (data.metrics.icuHeadroomDetails.currentIcuNonCovid / icuPerTotal) *
      100
    ).toFixed(2);

    const emb = new MessageEmbed();
    emb.setAuthor(
      `CovidActNow Stats for ${data.state.State}`,
      "https://www.covidactnow.org/static/media/can_logo.0ac0983b.png",
      `https://covidactnow.org/us/${data.state.State.toLowerCase().replace(
        / /g,
        "_",
      )}-${data.state.Code.toLowerCase()}`,
    );
    emb.setColor(
      lerp(0x00ff00, 0xff0000, data.metrics.testPositivityRatio / 0.1),
    );
    emb.addField("Positivity Ratio", `${posRatio}%`);
    emb.addField("Case Density per 100k", cDensity);
    emb.addField("Infection Rate", inRate);
    emb.addField("Contact Tracer Capacity", `${traceRatio}%`);
    emb.addField("ICU Headroom Utilized", `${icuHeadroom}%`);
    emb.addField(
      "ICU Current Covid",
      `${data.metrics.icuHeadroomDetails.currentIcuCovid} (${icuCovPer}%)`,
    );
    emb.addField(
      "ICU Current Non-Covid",
      `${data.metrics.icuHeadroomDetails.currentIcuNonCovid} (${icuNonCovPer}%)`,
    );
    emb.addField("Total ICU", icuPerTotal);
    emb.setFooter(
      "Data provided by https://covidactnow.org covid statistics API.",
    );
    message.reply(emb);
  }
}

export default CovidCommand;
