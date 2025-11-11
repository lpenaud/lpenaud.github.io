import { serveDir } from "@std/http/file-server";

function getOpenCommand(): string | null {
  switch (Deno.build.os) {
    case "linux":
      return "xdg-open";
    case "windows":
      return "explorer"
    case "darwin":
      return "open";
    default:
      return null;
  }
}

async function open({ hostname, port }: Deno.NetAddr): Promise<void> {
  const cmd = getOpenCommand()
  if (cmd === null) {
    return;
  }
  const command = new Deno.Command(cmd, {
    args: [`http://${hostname}:${port}/`],
    stderr: "null",
    stdin: "null",
    stdout: "null",
  });
  await command.output()
}

const server = Deno.serve((req) => serveDir(req, {
  fsRoot: "build",
}))
open(server.addr);
