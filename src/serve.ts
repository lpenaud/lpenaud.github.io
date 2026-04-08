import { serveDir } from "@std/http/file-server";
import { open } from "./command.ts";
import { BUILD_DIR } from "./env.ts";

export async function serve(): Promise<number> {
  const server = Deno.serve((req) =>
    serveDir(req, {
      fsRoot: BUILD_DIR,
      showDirListing: true,
    })
  );
  await open(`http://${server.addr.hostname}:${server.addr.port}`);
  await server.finished;
  return 0;
}
