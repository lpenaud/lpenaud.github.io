import * as sass from "sass";
import * as pug from "pug";
import * as stdPath from "@std/path";

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

function nt(f1: string, f2: string): boolean {
  const s1 = tryStatsSync(f1);
  const s2 = tryStatsSync(f2);
  return s1 === null || s2 === null 
    || s1.mtime === null || s2.mtime === null
    || s1.mtime > s2.mtime;
}

interface BuildOptions {
  nodeModules: string;
  buildDir: string;
  mainStyle: string;
  distDir: string;
}

interface CompilePugOptions {
  mainStyle: string;
}

class Build {
  #nodeModules: string;

  #buildDir: string;

  #distDir: string;

  #mainStyle: string;

  static async fromEnv(): Promise<Build> {
    const options: BuildOptions = {
      nodeModules: "node_modules",
      buildDir: "build",
      distDir: "dist",
      mainStyle: "style/main.scss",
    };
    await Promise.all([mkdirp(options.buildDir), mkdirp(options.distDir)]);
    return new Build(options);
  }

  constructor({ nodeModules, buildDir, distDir, mainStyle }: BuildOptions) {
    this.#buildDir = stdPath.resolve(buildDir);
    this.#nodeModules = stdPath.resolve(nodeModules);
    this.#distDir = stdPath.resolve(distDir);
    this.#mainStyle = stdPath.resolve(mainStyle);
  }

  compileSass(): string {
    const name = stdPath.basename(this.#mainStyle, ".scss");
    const dest = stdPath.join(this.#buildDir, `${name}.css`);
    if (nt(dest, this.#mainStyle)) {
      return stdPath.basename(dest);
    }
    const result = sass.compile(this.#mainStyle, {
      loadPaths: [this.#nodeModules],
    });
    Deno.writeTextFileSync(dest, result.css);
    return stdPath.basename(dest);
  }

  compilePug(options: CompilePugOptions): string {
    const compiler = pug.compileFile("template/main-layout.pug");
    const result = compiler(options);
    const dest = stdPath.join(this.#buildDir, "index.html")
    Deno.writeTextFileSync(dest, result)
    return dest;
  }
}

async function main(): Promise<number> {
  const build = await Build.fromEnv();
  const mainStyle = build.compileSass()
  console.log(build.compilePug({ mainStyle }))
  return 0;
}

if (import.meta.main) {
  main().then(Deno.exit);
}
