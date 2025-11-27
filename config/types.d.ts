export interface NavbarItem {
  href: string;
  text: string;
  active?: boolean;
}

export interface Picture {
  alt: string;
  src?: string;
}

export interface Toolbox {
  title: string;
  tools: Picture[];
}

export interface PugConfig {
  navbarStartItems: NavbarItem[];
  navbarEndItems: NavbarItem[];
  toolboxes: Toolbox[];
}
