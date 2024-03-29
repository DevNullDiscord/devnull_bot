import axios from "axios";
import Discord from "discord.js";
import * as storage from "../storage";

export interface IEvergreenMon {
  channel: string;
  last_update: number;
  last_status: boolean;
  role_id?: string;
}

export async function getEvergreenStatus(): Promise<boolean> {
  const res = await axios.get("https://istheshipstillstuck.com");
  const reg = /Yes\.<\/a>/i;
  return reg.test(res.data);
}

let etimeout: NodeJS.Timeout | null = null;

export async function initEvergreen(client: Discord.Client): Promise<void> {
  if (etimeout != null) return;
  const estore = storage.getCollection<IEvergreenMon>("evergreen-mon");
  if (estore["evergreen"] != undefined) {
    // exists.
    const edata = estore["evergreen"];
    if (!edata.last_status) return;
    const channel = (await client.channels.fetch(
      edata.channel,
    )) as Discord.TextChannel;
    const caller = async () => {
      if (Date.now() - edata.last_update < 1000 * 60 * 60) return;
      edata.last_status = await getEvergreenStatus();
      edata.last_update = Date.now();
      await channel.send(
        `Is the Ever Given still stuck?\n${
          edata.last_status ? "Yes." : "Nope! It's free!"
        }`,
      );
      if (!edata.last_status) {
        // FREE LETS STOP SPAMMING
        if (etimeout != null) clearInterval(etimeout);
        etimeout = null;
        if (edata.role_id != undefined) {
          await channel.send(`<@&${edata.role_id}> FREEDOM!`);
        }
      }
    };
    etimeout = setInterval(async () => {
      await caller();
    }, 10000);
    await caller();
  }
}
