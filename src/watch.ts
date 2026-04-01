import { delay } from "@std/async/delay";

export interface WatcherOptions {
  ms: number;
  dirs: string[] | string;
}

export class Watcher {
  #watch: Deno.FsWatcher;

  #task: Promise<void> | null;

  #ms: number;

  #entries: Set<string>;

  constructor({ dirs, ms }: WatcherOptions) {
    this.#watch = Deno.watchFs(dirs, {
      recursive: true,
    });
    this.#ms = ms;
    this.#entries = new Set();
    this.#task = null;
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
        const old = Array.from(this.#entries);
        this.#entries = new Set();
        yield old;
      }
    }
  }
}