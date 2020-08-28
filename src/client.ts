import { cmdPrefix, ownerID } from "./config";
import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import Path from "path";

class DevNullClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID,
      },
      {
        disableMentions: "everyone",
      },
    );
    this.commandHandler = new CommandHandler(this, {
      directory: Path.resolve(__dirname, "./bot/commands/"),
      prefix: cmdPrefix,
      defaultCooldown: 1000,
      allowMention: true,
      ignoreCooldown: ownerID,
      ignorePermissions: ownerID,
      handleEdits: true,
      commandUtil: true,
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: Path.resolve(__dirname, "./bot/listeners/"),
    });
    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: Path.resolve(__dirname, "./bot/inhibitors/"),
    });
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.listenerHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.commandHandler.loadAll();
  }
}

const client = new DevNullClient();
export default client;
