interface IUserData {
  id: string;
}

const storage: Map<string, IUserData> = new Map();

export default storage;
