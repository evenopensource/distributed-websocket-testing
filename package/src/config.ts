import { Config } from "./types";
import os from "os";
import { join } from "path";

const appName: string = "even";
let platform: "mac" | "windows" | "linux";
let logDirPath: string;
let tempDirPath: string = join(os.tmpdir(), appName);

if (process.platform === "win32") {
  //windows
  logDirPath = join(os.homedir(), "AppData", "Local", appName, "logs");
  platform = "windows";
} else if (process.platform === "darwin") {
  // macOS
  logDirPath = join(os.homedir(), "Library", "Logs", appName);
  platform = "mac";
} else {
  // Linux
  logDirPath = join(os.homedir(), ".local", "share", appName, "logs");
  platform = "linux";
}

const config: Config = {
  appName: appName,
  logDirPath: logDirPath,
  platform: platform,
  tempDirPath: tempDirPath,
};

export default config;
