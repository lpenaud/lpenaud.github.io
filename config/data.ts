import { toolboxes } from "./toolboxes.ts";
import { PugConfig } from "./types.d.ts";

export const pugConfig: PugConfig = {
  navbarStartItems: [
    {
      href: "#about-me",
      text: "À propos de moi",
      active: true,
    },
    {
      href: "#skills",
      text: "Compétences",
    },
    {
      href: "#experience",
      text: "Expérience",
    },
    {
      href: "#tools",
      text: "Outils et cadriciels",
    },
    {
      href: "#contact",
      text: "Contact",
    },
  ],
  navbarEndItems: [
    {
      href: "#blog",
      text: "Blog",
    },
  ],
  toolboxes,
};
