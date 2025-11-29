import { Toolbox } from "./types.d.ts";

const programmingLanguages: Toolbox = {
  title: "Langage de programmation",
  tools: [
    {
      alt: "C",
      src: "https://icon.icepanel.io/Technology/svg/C.svg",
    },
    {
      alt: "Go",
      src: "https://icon.icepanel.io/Technology/svg/Go.svg",
    },
    {
      alt: "Java",
      src: "https://icon.icepanel.io/Technology/svg/Java.svg",
    },
    {
      alt: "JavaScript",
      src: "https://icon.icepanel.io/Technology/svg/JavaScript.svg",
    },
    {
      alt: "Python",
      src: "https://icon.icepanel.io/Technology/svg/Python.svg",
    },
    {
      alt: "TypeScript",
      src: "https://icon.icepanel.io/Technology/svg/TypeScript.svg",
    },
    {
      alt: "Bash",
      src: "https://icon.icepanel.io/Technology/svg/Bash.svg",
    },
  ],
};

const system: Toolbox = {
  title: "Système",
  tools: [
    {
      alt: "ArchLinux",
      src: "https://icon.icepanel.io/Technology/svg/Arch-Linux.svg",
    },
    {
      alt: "Debian",
      src: "https://icon.icepanel.io/Technology/svg/Debian.svg",
    },
    {
      alt: "Ubuntu",
      src: "https://icon.icepanel.io/Technology/svg/Ubuntu.svg",
    },
    {
      alt: "Raspberry Pi",
      src: "https://icon.icepanel.io/Technology/svg/Raspberry-Pi.svg",
    },
    {
      alt: "Armbian",
      src:
        "https://raw.githubusercontent.com/armbian/documentation/refs/heads/main/docs/images/logo.svg",
    },
  ],
};

const backEnd: Toolbox = {
  title: "Dorsale",
  tools: [
    {
      alt: "Node.js",
      src: "https://icon.icepanel.io/Technology/svg/Node.js.svg",
    },
    {
      alt: "Deno",
      src: "https://deno.com/logos/icon-light.svg",
      basename: "deno-light.svg",
      sources: [
        {
          media: "(prefers-color-scheme: dark)",
          src: "https://deno.com/logos/icon-dark.svg",
          basename: "deno-dark.svg"
        },
        {
          media: "(prefers-color-scheme: light)",
          src: "https://deno.com/logos/icon-light.svg",
          basename: "deno-light.svg"
        },
      ],
    },
    {
      alt: "Spring",
      src: "https://icon.icepanel.io/Technology/svg/Spring.svg",
    },
    {
      alt: "NPM",
      src: "https://icon.icepanel.io/Technology/svg/NPM.svg",
    },
    {
      alt: "Yarn",
      src: "https://icon.icepanel.io/Technology/svg/Yarn.svg",
    },
    {
      alt: "Express",
      src: "https://icon.icepanel.io/Technology/svg/Express.svg",
    },
    {
      alt: "Socket.io",
      src: "https://icon.icepanel.io/Technology/svg/Socket.io.svg",
    },
  ],
};

const databases: Toolbox = {
  title: "Base de données",
  tools: [
    {
      alt: "MongoDB",
      src: "https://icon.icepanel.io/Technology/svg/MongoDB.svg",
    },
    {
      alt: "MySQL",
      src: "https://icon.icepanel.io/Technology/svg/MySQL.svg",
    },
    {
      alt: "PostgresSQL",
      src: "https://icon.icepanel.io/Technology/svg/PostgresSQL.svg",
    },
    {
      alt: "SQLite",
      src: "https://icon.icepanel.io/Technology/svg/SQLite.svg",
    },
  ],
};

const frontEnd: Toolbox = {
  title: "Frontale",
  tools: [
    {
      alt: "Vue",
      src: "https://icon.icepanel.io/Technology/svg/Vue.js.svg",
    },
    {
      alt: "Vite",
      src: "https://icon.icepanel.io/Technology/svg/Vite.js.svg",
    },
    {
      alt: "Pug.js",
      src:
        "https://raw.githubusercontent.com/pugjs/pug-logo/refs/heads/master/SVG/pug-final-logo-_-colour-128.svg",
    },
    {
      alt: "Bulma",
      src: "https://icon.icepanel.io/Technology/svg/Bulma.svg",
    },
    {
      alt: "Vuetify",
      src: "https://icon.icepanel.io/Technology/svg/Veutify.svg",
    },
    {
      alt: "HTML5",
      src: "https://icon.icepanel.io/Technology/svg/HTML5.svg",
    },
    {
      alt: "CSS3",
      src: "https://icon.icepanel.io/Technology/svg/CSS3.svg",
    },
  ],
};

const development: Toolbox = {
  title: "Développement",
  tools: [
    {
      alt: "Code",
      src: "https://vscodium.com/img/codium_cnl.svg",
    },
    {
      alt: "Eclipse",
      src: "https://icon.icepanel.io/Technology/svg/Eclipse-IDE.svg",
    },
    {
      alt: "Vim",
      src: "https://icon.icepanel.io/Technology/svg/Vim.svg",
    },
    {
      alt: "Git",
      src: "https://icon.icepanel.io/Technology/svg/Git.svg",
    },
    {
      alt: "SVN",
      src: "https://icon.icepanel.io/Technology/svg/Apache-Subversion.svg",
    },
    {
      alt: "OpenAPI",
      src: "https://icon.icepanel.io/Technology/svg/OpenAPI.svg",
    },
    {
      alt: "Ant",
      src:
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Apache-Ant-logo.svg",
    },
    {
      alt: "Gradle",
      src: "https://icon.icepanel.io/Technology/svg/Gradle.svg",
    },
  ],
};

const devOps: Toolbox = {
  title: "DevOps",
  tools: [
    {
      alt: "Docker",
      src: "https://icon.icepanel.io/Technology/svg/Docker.svg",
    },
    {
      alt: "GitLab CI",
      src: "https://icon.icepanel.io/Technology/svg/GitLab.svg",
    },
    {
      alt: "Github CI",
      src: "https://icon.icepanel.io/Technology/svg/GitHub.svg",
    },
    {
      alt: "Vagrant",
      src: "https://icon.icepanel.io/Technology/svg/HashiCorp-Vagrant.svg",
    },
    {
      alt: "VirtualBox",
      src:
        "https://upload.wikimedia.org/wikipedia/commons/f/ff/VirtualBox_2024_Logo.svg",
    },
    {
      alt: "YAML",
      src: "https://icon.icepanel.io/Technology/svg/YAML.svg",
    },
    {
      alt: "SSH",
      src: "https://icon.icepanel.io/Technology/svg/SSH.svg",
    },
  ],
};

const documentation: Toolbox = {
  title: "Documentation",
  tools: [
    {
      alt: "Mkdocs",
      src:
        "https://upload.wikimedia.org/wikipedia/commons/d/dd/MkDocs_Logo.png",
    },
    {
      alt: "Mermaid.js",
      src:
        "https://upload.wikimedia.org/wikipedia/commons/7/77/Mermaid_Logo.svg",
    },
    {
      alt: "UML",
      src:
        "https://icon.icepanel.io/Technology/svg/Unified-Modelling-Language-(UML).svg",
    },
  ],
};

const testing: Toolbox = {
  title: "Tests",
  tools: [
    {
      alt: "Postman",
      src: "https://icon.icepanel.io/Technology/svg/Postman.svg",
    },
    {
      alt: "Vitest",
      src: "https://vitest.fr/_astro/logo-vitest.CSLvu-Vl.svg",
    },
    {
      alt: "Cypress",
      src: "https://icon.icepanel.io/Technology/svg/Cypress.svg",
    },
    {
      alt: "Mocha",
      src: "https://icon.icepanel.io/Technology/svg/Mocha.svg",
    },
  ],
};

export const toolboxes: Toolbox[] = [
  programmingLanguages,
  backEnd,
  frontEnd,
  devOps,
  documentation,
  testing,
  development,
  databases,
  system,
];
