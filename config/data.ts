import { experiences } from "./experiences.ts";
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
  navbarEndItems: [],
  toolboxes,
  experiences,
  profile: {
    picture: {
      alt: "Photo de 3 quarts face de Penaud Loïc",
      src: "img/profile.flop.jpg",
    },
  },
  i18n: {
    "fr-FR": {
      "footer.develop.with": "Développé avec",
      "footer.love": "amour",
      "footer.with.help": "à l'aide de : "
    },
    "en": {
      "footer.develop.with": "Develop with",
      "footer.love": "love",
      "footer.with.help": "with help from: "
    }
  }
};
