import { Command, PrefixSupplier } from "discord-akairo";
import { Message } from "discord.js";
import { MessageEmbed } from "discord.js";

class HelpCommand extends Command {
  constructor() {
    super("help", {
      aliases: ["help"],
      description: {
        content:
          "Displays a list of available commands, or detailed information about a specific command.",
        usage: "<command>",
      },
      category: "util",
      args: [
        {
          id: "command",
          type: "commandAlias",
        },
      ],
    });
  }

  async exec(
    message: Message,
    { command }: { command: Command },
  ): Promise<Message> {
    const prefix = this.handler.prefix;
    const color = 0x4b4d91;
    if (!command) {
      const emb = new MessageEmbed()
        .setColor(color)
        .addField(
          "Commands",
          `A list of available commands.\nFor additional info on a command, type \`${prefix}help <command>\``,
        );
      for (const category of this.handler.categories.values()) {
        try {
          emb.addField(
            `${category.id.replace(/(\b\w)/gi, (lc): string =>
              lc.toUpperCase(),
            )}`,
            `${category
              .filter((cmd): boolean => cmd.aliases.length > 0)
              .map((cmd): string => `\`${cmd.aliases[0]}\``)
              .join(" ")}`,
          );
        } catch (e) {
          // ignore empty commands.
        }
      }
      return message.util!.send(emb);
    }
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(
        `\`${command.aliases[0]} ${
          command.description.usage ? command.description.usage : ""
        }\``,
      )
      .addField(
        "Description",
        `${command.description.content ? command.description.content : ""} ${
          command.description.ownerOnly ? "\n**[Owner Only]**" : ""
        }`,
      );

    if (command.aliases.length > 1)
      embed.addField("Aliases", `\`${command.aliases.join("` `")}\``, true);
    if (command.description.examples && command.description.examples.length)
      embed.addField(
        "Examples",
        `\`${command.aliases[0]} ${command.description.examples.join(
          `\`\n\`${command.aliases[0]} `,
        )}\``,
        true,
      );

    return message.util!.send(embed);
  }
}

export default HelpCommand;
