import * as sass from "sass";
import * as pug from "pug";
import * as stdPath from "@std/path";
import * as fs from "@std/fs";
import { delay } from "@std/async/delay";
import { pugConfig } from "../config/data.ts";
import type { Picture, PugConfig, Source, Toolbox } from "../config/types.d.ts";

function mkdirp(path: string | URL) {
  console.log("Make directory", path.toString());
  return Deno.mkdir(path, {
    recursive: true,
  });
}

function copyFileVerb(src: string | URL, dest: string | URL) {
  console.log("Copy", src.toString(), "to", dest.toString());
  return Deno.copyFile(src, dest);
}

function readDirVerb(path: string | URL) {
  console.log("ls", path.toString())
  return Deno.readDir(path);
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

interface PictureEntry {
  src: string;
  url: URL;
}

function getPicEntry(src: string, basename: string | undefined): PictureEntry {
  return {
    src: `img/${basename || stdPath.basename(src)}`,
    url: src.startsWith("http") ? new URL(src) : stdPath.toFileUrl(src),
  };
}

interface DownlaodPicture {
  picture: Picture;
  urls: [src: string, url: URL][];
}

function* genPic(pictures: Picture[]): Generator<DownlaodPicture> {
  for (const pic of pictures) {
    const sources: Source[] = [];
    const urls: DownlaodPicture["urls"] = [];
    let entry: PictureEntry;
    let src = pic.src;
    if (src) {
      entry = getPicEntry(src, pic.basename);
      src = entry.src;
      urls.push([entry.src, entry.url]);
    }
    if (pic.sources) {
      for (const s of pic.sources) {
        entry = getPicEntry(s.src, s.basename);
        sources.push({
          media: s.media,
          src: entry.src,
        });
        urls.push([entry.src, entry.url]);
      }
    }
    yield {
      picture: {
        sources,
        src,
        alt: pic.alt,
      },
      urls,
    };
  }
}

async function downlaodPicture(src: URL, dest: string): Promise<void> {
  if ((await tryStats(dest)) !== null) {
    return;
  }
  if (src.protocol === "file:") {
    await copyFileVerb(src, dest);
    return;
  }
  const res = await fetch(src);
  console.log("Fetch", src.href);
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
  console.log("Downlaod", src.href, "to", dest);
}

interface BuildOptions {
  nodeModules: string;
  buildDir: string;
  mainStyle: string;
  pages: string[];
}

interface CompilePugOptions extends PugConfig {
  mainStyle: string;
  scripts: string[];
}

interface PugFilterOptions {
  filename: string;
}

class Build {
  #nodeModules: string;

  #buildDir: string;

  #mainStyle: string;

  #pages: string[];

  static async fromEnv(): Promise<Build> {
    const nodeModules = "node_modules";
    const buildDir = "build";
    const iconDir = stdPath.join(nodeModules, "@material-design-icons/svg");
    await Promise.all([
      mkdirp(stdPath.join(buildDir, "img")),
      mkdirp(stdPath.join(buildDir, "icon")),
    ]);
    return new Build({
      nodeModules,
      buildDir,
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
    });
    Deno.writeTextFileSync(dest, result.css);
    return stdPath.basename(dest);
  }

  getMaterialIcon(name: string) {
    const src = this.#getMaterialSrcPath(name);
    console.log(src);
    return Deno.readTextFileSync(src);
  }

  async downlaodPictures(options: PugConfig): Promise<void> {
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
    const entries = await Array.fromAsync(fs.walk("js", {
      exts: [".mjs"],
      includeFiles: true,
      includeDirs: false,
      includeSymlinks: false,
    }));
    if (entries.length === 0) {
      return [];
    }
    const outdir = stdPath.join(this.#buildDir, "js");
    await mkdirp(outdir);
    await Promise.all(entries.map((e) => copyFileVerb(e.path, stdPath.join(outdir, e.name))));
    return entries.map(({ name }) => `js/${name}`);
  }

  async getCompileOptions(config: PugConfig): Promise<CompilePugOptions> {
    await this.downlaodPictures(config);
    return {
      ...config,
      mainStyle: this.compileSass(),
      scripts: await this.getScripts(),
    }
  }

  compilePug(options: CompilePugOptions): string[] {
    return this.#pages.map((p) => {
      const name = stdPath.basename(p, ".pug");
      const dest = stdPath.join(this.#buildDir, `${name}.html`);
      const compiler = pug.compileFile(p, {
        filters: {
          "material-icon": (
            _text: string,
            { name }: PugFilterOptions & { style: string; name: string },
          ) => this.getMaterialIcon(name),
          "icon-text": (
            text: string,
            { name, size }: PugFilterOptions & { style: string; name: string; size?: string; },
          ) => {
            const classList = ["icon"]
            if (size !== undefined) {
              classList.push(`is-${size}`);
            }
            return `<span class="icon-text"><span class="${classList.join(" ")}">${
              this.getMaterialIcon(name)
            }</span><span>${text}</span></span>`
          },
        },
      });
      const result = compiler(options);
      Deno.writeTextFileSync(dest, result);
      return stdPath.basename(dest);
    });
  }

  #getMaterialSrcPath(name: string) {
    return stdPath.join(
      this.#nodeModules,
      "@mdi/svg/svg",
      `${name}.svg`,
    );
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

if (import.meta.main) {
  main(Deno.args.slice()).then(Deno.exit);
}
