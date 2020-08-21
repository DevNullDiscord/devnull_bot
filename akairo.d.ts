import {
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";

declare module "discord-akairo" {
  declare interface AkairoClient {
    commandHandler?: CommandHandler;
    listenerHandler?: ListenerHandler;
    inhibitorHandler?: InhibitorHandler;
  }
}
