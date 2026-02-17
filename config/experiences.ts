import type { Experience, PugConfig } from "./types.d.ts";

const infotel: Experience = {
  alt: "Logo d’Infotel",
  src: "img/logo_infotel_crop.png",
};

const shakabay: Experience = {
  alt: "Logo de Shakabay",
  src: "img/shakabay.png",
};

const sentinellesDuWeb: Experience = {
  alt: "Logo des sentinelles du web",
  src: "img/sentinelle-du-web.png",
};

const zip: Experience = {
  alt: "Logo de Zip",
  src: "img/zip.png",
};

export const experiences: PugConfig["experiences"] = {
  infotel,
  shakabay,
  sentinellesDuWeb,
  zip,
};
