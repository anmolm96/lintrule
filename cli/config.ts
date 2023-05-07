import { join } from "https://deno.land/std@0.185.0/path/mod.ts";

export interface Config {
  accessToken?: string;
}

function getConfigPath() {
  // On linux this will be ~/.config/lintrule/config.json
  // On windows this will be %APPDATA%/lintrule/config.json
  // On mac this will be ~/.lintrule/config.json

  switch (Deno.build.os) {
    case "linux":
      return join(Deno.env.get("HOME") || "", ".config", "lintrule.json");
    case "windows":
      return join(Deno.env.get("APPDATA") || "", "lintrule", "config.json");
    case "darwin":
      return join(Deno.env.get("HOME") || "", ".lintrule", "config.json");
  }
}

export async function ensureEntirePath() {
  const configPath = getConfigPath();
  const configDir = join(configPath, "..");
  await Deno.mkdir(configDir, { recursive: true });
}

export async function readConfig(): Promise<Config> {
  await ensureEntirePath();
  const configPath = getConfigPath();
  try {
    const configText = await Deno.readTextFile(configPath);
    return JSON.parse(configText);
  } catch (_) {
    return {};
  }
}

export async function writeConfig(changes: Partial<Config>) {
  await ensureEntirePath();
  const configPath = getConfigPath();
  const config = readConfig();
  const newConfig = { ...config, ...changes };
  await Deno.writeTextFile(configPath, JSON.stringify(newConfig, null, 2));
}
