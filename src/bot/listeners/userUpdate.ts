import { Listener } from "discord-akairo";
import Discord from "discord.js";
import * as storage from "../../storage";

class UserUpdateListener extends Listener {
  constructor() {
    super("userUpdate", {
      emitter: "client",
      event: "userUpdate",
    });
  }
  async exec(oldUser: Discord.User, newUser: Discord.User) {
    if (oldUser.avatar != newUser.avatar) {
      // Track user avatar changes.
      const col = storage.getCollection<IUserData>("user-avatar-changes");
      const id = newUser.id;
      if (col[id] == undefined) col[id] = { updates: [] };
      const user = col[id];
      user.updates.push({ hash: newUser.avatar, timestamp: Date.now() });
    }
  }
}

export default UserUpdateListener;
