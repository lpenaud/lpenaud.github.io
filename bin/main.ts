import { build } from "../src/build.ts";
import { serve } from "../src/serve.ts";

const COMMANDS = Object.freeze(["build", "serve"] as const);

type Command = typeof COMMANDS[number];

function usage() {
  console.error(
    "Usage:",
    import.meta.filename ?? import.meta.url,
    "[COMMAND=build]",
  );
  console.error("Commands:", COMMANDS.join());
}

function isValidCommand(command: string): command is Command {
  return COMMANDS.includes(command as Command);
}

function run(command: Command, args: string[]): Promise<number> {
  switch (command) {
    case "build":
      return build(args);
    case "serve":
      return serve();
  }
}

async function main([command, ...args]: string[]) {
  if (command === undefined) {
    command = "build";
  }
  if (!isValidCommand(command)) {
    usage();
    return 1;
  }
  try {
    Deno.exit(await run(command, args));
  } catch (error) {
    console.error(`FATAL: ${error}`);
    Deno.exit(2);
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
