import * as sass from "sass";
import * as pug from "pug";
import * as stdPath from "@std/path";
import { delay } from "@std/async/delay";
import { pugConfig } from "../config/data.ts";
import type { Picture, PugConfig, Toolbox } from "../config/types.d.ts";

function mkdirp(dirpath: string) {
  return Deno.mkdir(dirpath, {
    recursive: true,
  });
}

function tryStatsSync(f: string): Deno.FileInfo | null {
  try {
    return Deno.statSync(f);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

async function tryStats(f: string): Promise<Deno.FileInfo | null> {
  try {
    return await Deno.stat(f);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

function nt(src: string, dest: string): boolean {
  const srcStat = Deno.statSync(src);
  const destStat = tryStatsSync(dest);
  if (destStat === null) {
    return false;
  }
  if (srcStat.mtime === null || destStat.mtime === null) {
    return false;
  }
  return destStat.mtime > srcStat.mtime;
}

interface DownlaodPicture {
  picture: Picture;
  url?: string;
}

function* genPic(pictures: Picture[]): Generator<DownlaodPicture> {
  for (const { alt, src } of pictures) {
    const pic: Picture = Object.create(null);
    const d: DownlaodPicture = Object.create(null);
    pic.alt = alt;
    if (src) {
      pic.src = `img/${stdPath.basename(src)}`;
      d.url = src;
    }
    d.picture = pic;
    yield d;
  }
}

async function downlaodPicture(src: string, dest: string): Promise<void> {
  if ((await tryStats(dest)) !== null) {
    return;
  }
  const res = await fetch(src);
  console.log("Fetch", src);
  if (!res.ok) {
    try {
      console.error(await res.text());
    } catch (_error) {
      // Ignore error
    }
    throw new Error(`${res.status} - ${res.statusText}`);
  }
  if (res.body === null) {
    throw new Error(`No body found from: ${src}`);
  }
  await Deno.writeFile(dest, res.body);
  console.log("Downlaod", src, "to", dest);
}

interface BuildOptions {
  nodeModules: string;
  buildDir: string;
  mainStyle: string;
  iconTypes: string[];
  pages: string[];
}

interface CompilePugOptions extends PugConfig {
  mainStyle: string;
}

interface PugFilterOptions {
  filename: string;
}

class Build {
  #nodeModules: string;

  #buildDir: string;

  #mainStyle: string;

  #iconTypes: string[];

  #pages: string[];

  static async fromEnv(): Promise<Build> {
    const nodeModules = "node_modules";
    const buildDir = "build";
    const iconDir = stdPath.join(nodeModules, "@material-design-icons/svg");
    const [, iconsEntries] = await Promise.all([
      mkdirp(stdPath.join(buildDir, "img")),
      Array.fromAsync(Deno.readDir(iconDir)),
    ]);
    return new Build({
      nodeModules,
      buildDir,
      mainStyle: "style/main.scss",
      iconTypes: iconsEntries.filter((e) => e.isDirectory)
        .map((e) => e.name),
      pages: ["template/index.pug"],
    });
  }

  constructor(
    { nodeModules, buildDir, mainStyle, pages, iconTypes }: BuildOptions,
  ) {
    this.#buildDir = stdPath.resolve(buildDir);
    this.#nodeModules = stdPath.resolve(nodeModules);
    this.#mainStyle = stdPath.resolve(mainStyle);
    this.#pages = pages.map((p) => stdPath.resolve(p));
    this.#iconTypes = iconTypes;
  }

  compileSass(): string {
    const name = stdPath.basename(this.#mainStyle, ".scss");
    const dest = stdPath.join(this.#buildDir, `${name}.css`);
    if (nt(this.#mainStyle, dest)) {
      return stdPath.basename(dest);
    }
    const result = sass.compile(this.#mainStyle, {
      loadPaths: [this.#nodeModules],
    });
    Deno.writeTextFileSync(dest, result.css);
    return stdPath.basename(dest);
  }

  getMaterialIcon(style: string, name: string) {
    if (!this.#iconTypes.includes(style)) {
      console.error(
        "Expected one of %c%s%c, actual: %c%s",
        "font-weight: bold;color: green;",
        this.#iconTypes.join(),
        "font-weight: unset;color: unset;",
        "font-weight: bold;color: red;",
        style,
      );
      throw new Error("Invalid icon style");
    }
    const src = stdPath.join(
      this.#nodeModules,
      "@material-design-icons/svg",
      style,
      `${name}.svg`,
    );
    console.log(src);
    return Deno.readTextFileSync(src);
  }

  async downlaodPictures(options: PugConfig): Promise<void> {
    const toolboxes: Toolbox[] = [];
    const pictures = new Map<string, string>();
    for (const toolbox of options.toolboxes) {
      const tools = Array.from(genPic(toolbox.tools));
      for (const { picture, url } of tools) {
        if (url === undefined) {
          continue;
        }
        pictures.set(url, picture.src as string);
      }
      toolboxes.push({
        title: toolbox.title,
        tools: tools.map((t) => t.picture),
      });
    }
    options.toolboxes = toolboxes;
    if (pictures.size === 0) {
      return
    }
    await Promise.all(pictures.entries().map(([s, d]) => downlaodPicture(s, stdPath.resolve(this.#buildDir, d))));
  }

  compilePug(options: CompilePugOptions): string[] {
    return this.#pages.map((p) => {
      const name = stdPath.basename(p, ".pug");
      const dest = stdPath.join(this.#buildDir, `${name}.html`);
      const compiler = pug.compileFile(p, {
        filters: {
          "material-icon": (
            _text: string,
            { name, style }: PugFilterOptions & { style: string; name: string },
          ) => this.getMaterialIcon(style, name),
          "icon-text": (
            text: string,
            { name, style }: PugFilterOptions & { style: string; name: string },
          ) =>
            `<span class="icon-text"><span class="icon">${
              this.getMaterialIcon(style, name)
            }</span><span>${text}</span></span>`,
        },
      });
      const result = compiler(options);
      Deno.writeTextFileSync(dest, result);
      return stdPath.basename(dest);
    });
  }
}

interface WatcherOptions {
  ms: number;
  dirs: string[] | string;
}

class Watcher {
  #watch: Deno.FsWatcher;

  #task: Promise<void> | null;

  #ms: number;

  #entries: Set<string>;

  constructor({ dirs, ms }: WatcherOptions) {
    this.#watch = Deno.watchFs(dirs, {
      recursive: true,
    });
    this.#ms = ms;
    this.#entries = new Set();
    this.#task = null;
  }

  async #start() {
    for await (const entry of this.#watch) {
      for (const p of entry.paths) {
        this.#entries.add(p);
      }
    }
  }

  async close() {
    this.#watch.close();
    if (this.#task !== null) {
      await this.#task;
    }
  }

  [Symbol.asyncDispose]() {
    return this.close();
  }

  async *[Symbol.asyncIterator]() {
    this.#task = this.#start();
    while (this.#task !== null) {
      await delay(this.#ms);
      if (this.#entries.size > 0) {
        const old = Array.from(this.#entries);
        this.#entries = new Set();
        yield old;
      }
    }
  }
}

async function main(args: string[]): Promise<number> {
  const watch = args.shift() === "watch";
  const build = await Build.fromEnv();
  const mainStyle = build.compileSass();
  console.log(mainStyle);
  await build.downlaodPictures(pugConfig);
  const pugOptions: CompilePugOptions = {
    mainStyle,
    ...pugConfig,
  };
  console.log(build.compilePug(pugOptions));
  if (!watch) {
    return 0;
  }
  await using watcher = new Watcher({
    dirs: ["style", "template", "config"],
    ms: 200,
  });
  for await (const paths of watcher) {
    if (paths.some((p) => p.endsWith(".pug"))) {
      console.log(build.compilePug(pugOptions));
    }
    if (paths.some((p) => p.endsWith(".scss"))) {
      console.log(build.compileSass());
    }
  }
  return 0;
}

if (import.meta.main) {
  main(Deno.args.slice()).then(Deno.exit);
}
