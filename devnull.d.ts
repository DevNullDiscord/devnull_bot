declare interface IUserAvatarChange {
  hash: string | null;
  timestamp: number;
}

declare interface IUserData {
  updates: IUserAvatarChange[];
}
