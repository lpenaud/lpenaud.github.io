import * as stdPath from "@std/path";
import { copyFileVerb, tryStats } from "./fs.ts";
import type { Picture, Source } from "../config/types.d.ts";

export interface PictureEntry {
  src: string;
  url: URL;
}

export function getPicEntry(src: string, basename: string | undefined): PictureEntry {
  const imgSrc = `img/${basename || stdPath.basename(src)}`;
  if (src.startsWith("http")) {
    return {
      src: imgSrc,
      url: new URL(src),
    };
  }
  return {
    src: imgSrc,
    url: stdPath.toFileUrl(stdPath.resolve(src)),
  };
}

export interface DownlaodPicture {
  picture: Picture;
  urls: [src: string, url: URL][];
}

export function* genPic(pictures: Picture[]): Generator<DownlaodPicture> {
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

export async function downlaodPicture(src: URL, dest: string): Promise<void> {
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
