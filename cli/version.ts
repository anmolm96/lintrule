import { version } from "./cli.json" assert { type: "json" };

export async function readVersion() {
  return version;
}
