import * as sass from "sass";
import * as pug from "pug";
import * as stdPath from "@std/path";
import { delay } from "@std/async/delay";

function mkdirp(dirpath: string) {
  return Deno.mkdir(dirpath, {
    recursive: true,
  });
}

function tryStatsSync(f: string): Deno.FileInfo | null {
  try {
    return Deno.statSync(f)
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null
    }
    throw error;
  }
}

function nt(src: string, dest: string): boolean {
  const srcStat = Deno.statSync(src);
  const destStat = tryStatsSync(dest);
  if (destStat === null) {
    return false
  }
  if (srcStat.mtime === null || destStat.mtime === null) {
    return false
  }
  return destStat.mtime > srcStat.mtime;
}

interface BuildOptions {
  nodeModules: string;
  buildDir: string;
  mainStyle: string;
  pages: string[];
}

interface CompilePugOptions {
  mainStyle: string;
}

class Build {
  #nodeModules: string;

  #buildDir: string;

  #mainStyle: string;

  #pages: string[];

  static async fromEnv(): Promise<Build> {
    const options: BuildOptions = {
      nodeModules: "node_modules",
      buildDir: "build",
      mainStyle: "style/main.scss",
      pages: ["template/index.pug"]
    };
    await mkdirp(options.buildDir);
    return new Build(options);
  }

  constructor({ nodeModules, buildDir, mainStyle, pages }: BuildOptions) {
    this.#buildDir = stdPath.resolve(buildDir);
    this.#nodeModules = stdPath.resolve(nodeModules);
    this.#mainStyle = stdPath.resolve(mainStyle);
    this.#pages = pages.map(p => stdPath.resolve(p));
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

  compilePug(options: CompilePugOptions): string[] {
    return this.#pages.map(p => {
      const name = stdPath.basename(p, ".pug");
      const dest = stdPath.join(this.#buildDir, `${name}.html`)
      const compiler = pug.compileFile(p);
      const result = compiler(options);
      Deno.writeTextFileSync(dest, result)
      return stdPath.basename(dest);;
    })
  }
}

interface WatcherOptions {
  ms: number;
  dirs: string[] | string
}

class Watcher {

  #watch: Deno.FsWatcher

  #task: Promise<void> | null

  #ms: number

  #entries: Set<string>

  constructor({ dirs, ms }: WatcherOptions) {
    this.#watch = Deno.watchFs(dirs, {
      recursive: true,
    })
    this.#ms = ms
    this.#entries = new Set();
    this.#task = null
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
        const old = Array.from(this.#entries)
        this.#entries = new Set()
        yield old;
      }
    }
  }
}

async function main(args: string[]): Promise<number> {
  const watch = args.shift() === "watch"
  const build = await Build.fromEnv();
  const pugOptions: CompilePugOptions = {
    mainStyle: build.compileSass()
  }
  console.log(build.compilePug(pugOptions));
  if (!watch) {
    return 0;
  }
  await using watcher = new Watcher({
    dirs: ["style", "template"],
    ms: 200,
  })
  for await (const paths of watcher) {
    if (paths.some(p => p.endsWith('.pug'))) {
      console.log(build.compilePug(pugOptions))
    }
    if (paths.some(p => p.endsWith('.scss'))) {
      console.log(build.compileSass());
    }
  }
  return 0;
}

if (import.meta.main) {
  main(Deno.args.slice()).then(Deno.exit);
}
