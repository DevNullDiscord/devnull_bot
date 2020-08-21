import { Listener } from "discord-akairo";

class ReadyListener extends Listener {
  constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    });
  }
  exec() {
    console.log(
      "Logged in as",
      `${this.client.user?.username}#${this.client.user?.discriminator}`,
    );
  }
}

export default ReadyListener;
