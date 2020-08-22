import Path from "path";
/*
  Parse all dotenv config variables.
*/

/**
 * Bot token used for the Discord client.
 */
export const discordToken: string =
  process.env["BOT_TOKEN"] == undefined ? "" : process.env["BOT_TOKEN"];

// Load ownerID value.
let owner: string | string[];
const ownerVal = process.env["OWNER_ID"];
if (ownerVal != undefined) {
  // Check if this contains multiples.
  const ownerList: string[] = ownerVal.split(",").map((v) => v.trim());
  if (ownerList.length > 1) {
    owner = ownerList;
  } else {
    owner = ownerList[0];
  }
} else {
  owner = "";
}
/**
 * The owner ID(s) for the bot.
 */
export const ownerID: string | string[] = owner;

/**
 * The bot command prefix.
 */
export const cmdPrefix: string = process.env["PREFIX"] || "!";

const interp: string = process.env["INTERPRETER_DIRECTORY"] || "./interpreter";
/**
 * The directory for interpreter file storage.
 */
export const interpreterDir: string = Path.isAbsolute(interp)
  ? interp
  : Path.resolve(interp);

/**
 * The path to cargo
 */
export const cargoPath: string = process.env["CARGO_PATH"] || "cargo";
