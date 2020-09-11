import fs from "fs-extra";
import path from "path";
import Discord from "discord.js";

const dataFolder = path.resolve(process.cwd(), "./_data");
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder);
}

interface UserProfilePicData {
  avatarID: string | null;
  changes: {
    date: string;
  }[];
}
type ProfilePicData = Record<string, UserProfilePicData>;
const profilePicFile = path.resolve(dataFolder, "profile-pic-changed.json");
if (!fs.existsSync(profilePicFile)) {
  fs.writeFile(profilePicFile, "{}");
}

export const getUserProfilePicData = (user: Discord.User) => {
  const profilePicData: ProfilePicData = JSON.parse(
    fs.readFileSync(profilePicFile).toString(),
  );
  if (!profilePicData[user.id]) {
    profilePicData[user.id] = {
      avatarID: user.avatar,
      changes: [],
    };
  }
  return profilePicData[user.id];
};

export const setUserProfilePicData = (
  userID: string,
  data: UserProfilePicData,
) => {
  const profilePicData: ProfilePicData = JSON.parse(
    fs.readFileSync(profilePicFile).toString(),
  );
  profilePicData[userID] = data;
  return fs.writeFile(profilePicFile, JSON.stringify(profilePicData));
};
