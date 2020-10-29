import { covidAPIKey } from "../config";
import axios from "axios";
import { getStateCode } from "./states";

export const covidAPI = axios.create({
  baseURL: "https://api.covidactnow.org/v2/",
});

export async function getStateRecent(
  state: string,
): Promise<{ [key: string]: any } | undefined> {
  const stateCode = getStateCode(state);
  if (stateCode == undefined) return;
  const res = await covidAPI.get(
    `state/${stateCode}.json?apiKey=${covidAPIKey}`,
  );
  return res.data;
}
