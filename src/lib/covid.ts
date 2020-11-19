import { covidAPIKey } from "../config";
import axios from "axios";
import { getStateCode, IState } from "./states";

export interface ICovMetrics {
  testPositivityRatio: number;
  testPositivityRatioDetails: {
    source: string;
  };
  caseDensity: number;
  contactTracerCapacityRatio: number;
  infectionRate: number;
  infectionRateCI90: number;
  icuHeadroomRatio: number;
  icuHeadroomDetails: {
    currentIcuCovid: number;
    currentIcuCovidMethod: string;
    currentIcuNonCovid: number;
    currentIcuNonCovidMethod: string;
  };
}

export interface ICovData {
  state: IState;
  metrics: ICovMetrics;
}

export const covidAPI = axios.create({
  baseURL: "https://api.covidactnow.org/v2/",
});

export async function getStateRecent(
  st: string,
): Promise<ICovData | undefined> {
  const state = getStateCode(st);
  if (state == undefined) return;
  const res = await covidAPI.get(
    `state/${state.Code}.json?apiKey=${covidAPIKey}`,
  );
  const d = res.data;
  if (d != undefined) {
    d.state = state;
    return d as ICovData;
  }
}
