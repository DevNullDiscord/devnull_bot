import { Listener } from "discord-akairo";
import Discord from "discord.js";
import { getUserProfilePicData } from "../../storage";

function isTextChannel(
  channel: Discord.Channel | undefined,
): channel is Discord.TextChannel {
  return !!channel && channel.type === "text";
}

const generalChannelID = "745405756119187516";

class ProfilePicChangedListener extends Listener {
  constructor() {
    super("profile-pic-changed", {
      emitter: "client",
      event: "profile-pic-changed",
    });
  }

  async exec(user: Discord.User) {
    // tslint:disable-next-line: no-console
    console.log(`${user.toString()} changed their profile picture`);
    const profilePicData = getUserProfilePicData(user);

    profilePicData.changes.push({
      date: new Date().toUTCString(),
    });

    // Typings are wrong. Collections contain a .get method and I'm too lazy to make
    // custom typings right now
    const channel = (this.client.channels.cache as any).get(
      generalChannelID,
    ) as Discord.Channel | undefined;
    if (isTextChannel(channel)) {
      const count = profilePicData.changes.length;
      const suffixLookup: Record<number, string | undefined> = {
        1: "st",
        2: "nd",
        3: "rd",
      };
      const suffix = suffixLookup[count] || "th";
      channel.send(
        `${user.toString()} changed their profile picture! This is the ${count}${suffix} time since I started counting.`,
      );
    }
  }
}

export default ProfilePicChangedListener;
