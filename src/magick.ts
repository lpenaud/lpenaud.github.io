import { createCommands } from "./command.ts";

export interface MagickCompressOptions {
  background?: string;
  resize?: number;
  blur?: number;
}

export async function magickCompress(
  infile: string,
  outfile: string,
  options: MagickCompressOptions = {},
) {
  const args: string[] = [infile];
  if (options.background) {
    args.push("-background", options.background, "-flatten");
  }
  if (options.resize) {
    // Not upscaling the picture when resize
    args.push("-resize", options.resize + ">");
  }
  // Remove all metadata
  // Progressive (optimise loading)
  args.push("-strip", "-interlace", "Plane");
  // Blur to reduce file size
  if (options.blur) {
    args.push("-gaussian-blur", options.blur.toString());
  }
  const cmd = createCommands("magick", {
    args: [
      ...args,
      // JPEG compression
      "-quality",
      "85%",
      outfile,
    ],
    stdout: "inherit",
    stderr: "inherit",
  });
  const output = await cmd.output();
  if (!output.success) {
    throw new Error(`magick exited with ${output.code} on '${infile}'`);
  }
}
