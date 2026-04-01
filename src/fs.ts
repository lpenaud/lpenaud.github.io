import * as fs from "@std/fs";
import * as stdPath from "@std/path";

export function mkdirp(path: string | URL) {
  console.log("Make directory", path.toString());
  return Deno.mkdir(path, {
    recursive: true,
  });
}

export async function writeTextFile<P extends string | URL>(path: P, data: string | ReadableStream<string>, options?: Deno.WriteFileOptions): Promise<P> {
  await Deno.writeTextFile(path, data, options);
  return path;
}

export function copyFileVerb(src: string | URL, dest: string | URL) {
  console.log("Copy", src.toString(), "to", dest.toString());
  return Deno.copyFile(src, dest);
}

export function tryStatsSync(f: string): Deno.FileInfo | null {
  try {
    return Deno.statSync(f);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

export async function tryStats(f: string): Promise<Deno.FileInfo | null> {
  try {
    return await Deno.stat(f);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

export function nt(src: string, dest: string): boolean {
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

export async function* walk(root: string | URL, options?: fs.WalkOptions) {
  for await (const entry of fs.walk(root, options)) {
    yield {
      ...entry,
      ...stdPath.parse(entry.path),
    }
  }
}
