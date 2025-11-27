export interface NavbarItem {
  href: string;
  text: string;
  active?: boolean;
}

export interface Tool {
  alt: string;
  src?: string;
}

export interface Toolbox {
  title: string;
  tools: Tool[];
}

export interface PugConfig {
  navbarStartItems: NavbarItem[];
  navbarEndItems: NavbarItem[];
  toolboxes: Toolbox[];
}

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
  toolboxes: [
    {
      title: "Langage de programmation",
      tools: [
        {
          alt: "JavaScript",
        },
        {
          alt: "Java",
        },
      ],
    },
    {
      title: "Système",
      tools: [
        {
          alt: "ArchLinux",
        },
        {
          alt: "Debian",
        },
      ],
    },
  ],
};
