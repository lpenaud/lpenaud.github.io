export function createCommands(
  command: string | URL,
  options?: Deno.CommandOptions,
) {
  if (options?.args) {
    console.log(command, ...options.args);
  }
  return new Deno.Command(command, options);
}

function getOpenCommand(): string | null {
  switch (Deno.build.os) {
    case "linux":
      return "xdg-open";
    case "windows":
      return "explorer";
    case "darwin":
      return "open";
    default:
      return null;
  }
}

export async function open(file: string): Promise<void> {
  const command = getOpenCommand();
  if (command === null) {
    throw new Error(`Unkown OS "${Deno.build.os}"`);
  }
  const cmd = createCommands(command, {
    args: [file],
    stderr: "null",
    stdout: "null",
    stdin: "null",
  });
  await cmd.output();
}
