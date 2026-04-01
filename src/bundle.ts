import { bundle } from "@deno/emit";
import { writeTextFile } from "./fs.ts";

export interface BrowserBundleOptions {
  sourceMap: boolean;
  minify: boolean;
}

export async function browserBundle(
  infile: string | URL,
  outfile: string,
  options?: Partial<BrowserBundleOptions>,
): Promise<string[]> {
  const { sourceMap, minify }: BrowserBundleOptions = {
    sourceMap: true,
    minify: false,
    ...options,
  };
  const { code, map } = await bundle(infile, {
    compilerOptions: {
      checkJs: false,
      sourceMap,
    },
    minify,
    type: "module",
  });
  const writes = [
    writeTextFile(outfile, code),
  ];
  if (map) {
    writes.push(writeTextFile(`${outfile}.map`, map));
  }
  const results = await Promise.all(writes);
  console.error(`bundle "${infile}" to "${outfile}"`);
  return results;
}
