import * as sass from "sass";
import * as pug from "pug";
import * as stdPath from "@std/path";
import type { Picture, PugConfig, Toolbox } from "../config/types.d.ts";
import { magickCompress } from "../src/magick.ts";
import { mkdirp, nt, walk } from "../src/fs.ts";
import { DownlaodPicture, downlaodPicture, genPic } from "../src/picture.ts";
import { pugConfig } from "../config/data.ts";
import { Watcher } from "./watch.ts";
import { browserBundle, BrowserBundleOptions } from "./bundle.ts";
import { BUILD_DIR, IS_DEV } from "./env.ts";

export interface BuildOptions {
  nodeModules: string;
  buildDir: string;
  mainStyle: string;
  pages: string[];
}

export interface CompilePugOptions extends Omit<PugConfig, "experiences"> {
  mainStyle: string;
  scripts: string[];
  experiences: {
    [k in keyof PugConfig["experiences"]]: Picture;
  };
}

export interface PugFilterOptions {
  filename: string;
}

export class Build {
  #nodeModules: string;

  #buildDir: string;

  #mainStyle: string;

  #pages: string[];

  static async fromEnv(): Promise<Build> {
    const nodeModules = "node_modules";
    await mkdirp(stdPath.join(BUILD_DIR, "img"));
    return new Build({
      nodeModules,
      buildDir: BUILD_DIR,
      mainStyle: "style/main.scss",
      pages: ["template/index.pug"],
    });
  }

  constructor(
    { nodeModules, buildDir, mainStyle, pages }: BuildOptions,
  ) {
    this.#buildDir = stdPath.resolve(buildDir);
    this.#nodeModules = stdPath.resolve(nodeModules);
    this.#mainStyle = stdPath.resolve(mainStyle);
    this.#pages = pages.map((p) => stdPath.resolve(p));
  }

  compileSass(): string {
    const name = stdPath.basename(this.#mainStyle, ".scss");
    const dest = stdPath.join(this.#buildDir, `${name}.css`);
    if (nt(this.#mainStyle, dest)) {
      return stdPath.basename(dest);
    }
    const result = sass.compile(this.#mainStyle, {
      loadPaths: [this.#nodeModules],
      style: IS_DEV ? "expanded" : "compressed",
      sourceMapIncludeSources: IS_DEV,
    });
    Deno.writeTextFileSync(dest, result.css);
    return stdPath.basename(dest);
  }

  getMaterialIcon(name: string) {
    const src = this.#getMaterialSrcPath(name);
    console.log(src);
    return Deno.readTextFileSync(src);
  }

  async downlaodToolboxPictures(options: PugConfig): Promise<void> {
    const toolboxes: Toolbox[] = [];
    const pictures: DownlaodPicture["urls"][] = [];
    for (const toolbox of options.toolboxes) {
      const tools: Picture[] = [];
      for (const t of genPic(toolbox.tools)) {
        tools.push(t.picture);
        pictures.push(t.urls);
      }
      toolboxes.push({
        title: toolbox.title,
        tools,
      });
    }
    options.toolboxes = toolboxes;
    if (pictures.length === 0) {
      return;
    }
    await Promise.all(
      pictures.flatMap((p) => p)
        .map(([dest, src]) =>
          downlaodPicture(src, stdPath.resolve(this.#buildDir, dest))
        ),
    );
  }

  async getScripts(): Promise<string[]> {
    const entries = await Array.fromAsync(walk("js", {
      exts: [".ts", ".mjs", ".js"],
      includeFiles: true,
      includeDirs: false,
      includeSymlinks: false,
    }));
    if (entries.length === 0) {
      return [];
    }
    const outdir = stdPath.join(this.#buildDir, "js");
    await mkdirp(outdir);
    const bundleOptions: BrowserBundleOptions = {
      minify: !IS_DEV,
      sourceMap: !IS_DEV,
    };
    await Promise.all(
      entries.map((e) =>
        browserBundle(
          e.path,
          stdPath.join(outdir, `${e.name}.js`),
          bundleOptions,
        )
      ),
    );
    return entries.map((e) => `js/${e.name}.js`);
  }

  async getCompileOptions(config: PugConfig): Promise<CompilePugOptions> {
    await this.downlaodToolboxPictures(config);
    await this.#compressProfile(config);
    return {
      ...config,
      mainStyle: this.compileSass(),
      scripts: await this.getScripts(),
      experiences: await this.#compressCompaniesLogo(config),
    };
  }

  compilePug(options: CompilePugOptions): string[] {
    return this.#pages.map((p) => {
      const name = stdPath.basename(p, ".pug");
      const dest = stdPath.join(this.#buildDir, `${name}.html`);
      const compiler = pug.compileFile(p, {
        compileDebug: IS_DEV,
        filters: {
          "material-icon": (
            _text: string,
            { name }: PugFilterOptions & { style: string; name: string },
          ) => this.getMaterialIcon(name),
          "icon-text": (
            text: string,
            { name, size }: PugFilterOptions & {
              style: string;
              name: string;
              size?: string;
            },
          ) => {
            const classList = ["icon"];
            if (size !== undefined) {
              classList.push(`is-${size}`);
            }
            return `<span class="icon-text"><span class="${
              classList.join(" ")
            }">${this.getMaterialIcon(name)}</span><span>${text}</span></span>`;
          },
        },
      });
      const result = compiler(options);
      Deno.writeTextFileSync(dest, result);
      return stdPath.basename(dest);
    });
  }

  async #compressProfile(config: PugConfig) {
    const infile = config.profile.picture.src;
    const outfile = stdPath.resolve(this.#buildDir, infile);
    await magickCompress(infile, outfile);
  }

  async #compressCompaniesLogo(
    options: PugConfig,
  ): Promise<CompilePugOptions["experiences"]> {
    const lightBg = "hsl(221,14%,100%)";
    const darkBg = "hsl(221,14%,9%)";
    const experiences: Partial<CompilePugOptions["experiences"]> = {};
    for (const [company, { alt, src }] of Object.entries(options.experiences)) {
      const path = stdPath.parse(src);
      const light = `img/${path.name}.light.jpg`;
      const dark = `img/${path.name}.dark.jpg`;
      await Promise.all([
        magickCompress(
          src,
          stdPath.resolve(this.#buildDir, light),
          {
            background: lightBg,
            resize: 96,
          },
        ),
        magickCompress(
          src,
          stdPath.resolve(this.#buildDir, dark),
          {
            background: darkBg,
            resize: 96,
          },
        ),
      ]);
      experiences[company as keyof CompilePugOptions["experiences"]] = {
        alt,
        src: light,
        sources: [
          { media: "(prefers-color-scheme: light)", src: light },
          { media: "(prefers-color-scheme: dark)", src: dark },
        ],
      };
    }
    return experiences as CompilePugOptions["experiences"];
  }

  #getMaterialSrcPath(name: string) {
    return stdPath.join(
      this.#nodeModules,
      "@mdi/svg/svg",
      `${name}.svg`,
    );
  }
}

export async function build(args: string[]): Promise<number> {
  const watch = args.shift() === "watch";
  const build = await Build.fromEnv();
  const pugOptions = await build.getCompileOptions(pugConfig);
  console.log(build.compilePug(pugOptions));
  if (!watch) {
    return 0;
  }
  await using watcher = new Watcher({
    dirs: ["style", "template", "config", "js"],
    ms: 200,
  });
  for await (const paths of watcher) {
    const exts = Map.groupBy(paths, (p) => stdPath.extname(p));
    if (exts.has(".pug")) {
      console.log(build.compilePug(pugOptions));
    }
    if (exts.has(".scss")) {
      console.log(build.compileSass());
    }
    if (exts.has(".mjs")) {
      await build.getScripts();
    }
  }
  return 0;
}
