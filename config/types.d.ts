export interface NavbarItem {
  href: string;
  text: string;
  active?: boolean;
}

export interface Source {
  src: string;
  media: string;
  basename?: string;
}

export interface Picture {
  alt: string;
  src?: string;
  basename?: string;
  sources?: Source[];
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
