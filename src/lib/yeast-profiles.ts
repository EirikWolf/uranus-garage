import type { YeastProfile } from "./types";

export const yeastProfiles: YeastProfile[] = [
  // --- Tørrgjær (Ale) ---
  { name: "Safale US-05 (Amerikansk ale)", attenuation: 0.81, tempRangeLow: 15, tempRangeHigh: 24, tempOptimal: 18, flocculationRate: 0.6, type: "ale" },
  { name: "Safale S-04 (Engelsk ale)", attenuation: 0.75, tempRangeLow: 15, tempRangeHigh: 24, tempOptimal: 18, flocculationRate: 0.8, type: "ale" },
  { name: "Safale S-33 (Belgisk ale)", attenuation: 0.70, tempRangeLow: 15, tempRangeHigh: 24, tempOptimal: 20, flocculationRate: 0.5, type: "ale" },
  { name: "Safale BE-256 (Abbeygjær)", attenuation: 0.82, tempRangeLow: 15, tempRangeHigh: 28, tempOptimal: 22, flocculationRate: 0.7, type: "ale" },
  { name: "Safale K-97 (Tysk hveteøl)", attenuation: 0.82, tempRangeLow: 15, tempRangeHigh: 24, tempOptimal: 20, flocculationRate: 0.3, type: "ale" },
  { name: "Nottingham (Engelsk ale)", attenuation: 0.80, tempRangeLow: 14, tempRangeHigh: 21, tempOptimal: 17, flocculationRate: 0.9, type: "ale" },
  { name: "BRY-97 (West Coast ale)", attenuation: 0.83, tempRangeLow: 15, tempRangeHigh: 22, tempOptimal: 18, flocculationRate: 0.7, type: "ale" },

  // --- Tørrgjær (Lager) ---
  { name: "Saflager W-34/70 (Tysk lager)", attenuation: 0.83, tempRangeLow: 9, tempRangeHigh: 15, tempOptimal: 12, flocculationRate: 0.8, type: "lager" },
  { name: "Saflager S-23 (Europeisk lager)", attenuation: 0.82, tempRangeLow: 9, tempRangeHigh: 15, tempOptimal: 12, flocculationRate: 0.7, type: "lager" },

  // --- Flytende gjær (Ale) ---
  { name: "Wyeast 1056 / WLP001 (Amerikansk ale)", attenuation: 0.77, tempRangeLow: 15, tempRangeHigh: 22, tempOptimal: 19, flocculationRate: 0.6, type: "ale" },
  { name: "Wyeast 1098 / WLP007 (Engelsk ale)", attenuation: 0.75, tempRangeLow: 16, tempRangeHigh: 22, tempOptimal: 19, flocculationRate: 0.8, type: "ale" },
  { name: "Wyeast 3068 / WLP300 (Hefeweizen)", attenuation: 0.76, tempRangeLow: 16, tempRangeHigh: 24, tempOptimal: 19, flocculationRate: 0.2, type: "ale" },
  { name: "Wyeast 1214 / WLP500 (Belgisk abbey)", attenuation: 0.78, tempRangeLow: 17, tempRangeHigh: 28, tempOptimal: 23, flocculationRate: 0.5, type: "ale" },

  // --- Kveik ---
  { name: "Kveik Voss (Sigmund)", attenuation: 0.83, tempRangeLow: 25, tempRangeHigh: 40, tempOptimal: 35, flocculationRate: 0.9, type: "ale" },
  { name: "Kveik Hornindal", attenuation: 0.80, tempRangeLow: 25, tempRangeHigh: 40, tempOptimal: 32, flocculationRate: 0.7, type: "ale" },
];

export function getYeastByName(name: string): YeastProfile | undefined {
  return yeastProfiles.find((y) => y.name === name);
}

export function getAllYeastNames(): string[] {
  return yeastProfiles.map((y) => y.name);
}
