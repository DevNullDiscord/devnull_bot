import axios from "axios";
import Discord from "discord.js";
import * as storage from "../storage";

export interface IEvergreenMon {
    channel: string;
    last_update: number;
    last_status: boolean;
}

export async function getEvergreenStatus(): Promise<boolean> {
    const res = await axios.get("https://istheshipstillstuck.com");
    const reg = /Yes\.<\/a>/i;
    return reg.test(res.data);
}

let etimeout: NodeJS.Timeout | null = null;

function getEverGivenRole(channel: Discord.TextChannel): Discord.Role | undefined {
    return channel.guild.roles.cache.find(role => role.name === 'Ever Given');
}

export async function initEvergreen(client: Discord.Client): Promise<void> {
    if (etimeout != null) return;
    const estore = storage.getCollection<IEvergreenMon>("evergreen-mon");
    if (estore["evergreen"] != undefined) {
        // exists.
        const edata = estore["evergreen"];
        if (!edata.last_status) return;
        const channel = await client.channels.fetch(edata.channel) as Discord.TextChannel;
        const r = getEverGivenRole(channel)
        if (r) {
            channel.send(`Test mention: <@&${r.id}>`)
        } else {
            channel.send('Unable to find Ever Given role')
        }
        const caller = async () => {
            if (Date.now() - edata.last_update < 1000 * 60 * 60) return;
            const isStillStuck = edata.last_status = await getEvergreenStatus();
            edata.last_update = Date.now();
            let everGivenRoleMention = '';
            if (!isStillStuck) {
                const everGivenRole = getEverGivenRole(channel)
                if (everGivenRole?.id) {
                    everGivenRoleMention = `<@&${everGivenRole.id}>`;
                }
            }
            channel.send(`Is the Ever Given still stuck?\n${isStillStuck ? "Yes." : `Nope! It's free! ${everGivenRoleMention}`}`);
            if (!edata.last_status) {
                // FREE LETS STOP SPAMMING
                if (etimeout != null)
                    clearInterval(etimeout);
                etimeout = null;
            }
        };
        etimeout = setInterval(async () => {
            await caller();
        }, 10000);
        await caller();
    }
}