import { existsSync, createWriteStream, WriteStream } from "fs";
import { readdir, unlink, mkdir } from "fs/promises";
import config from "../config";
import { Server } from "../types";
import { join } from "path";

const logWriteStreams: { [key: string]: WriteStream } = {};

export const initLogger = async (servers: Server[]): Promise<boolean> => {
  const logDir: string = config.logDirPath;
  return new Promise(async(resolve, reject) => {
    try {
      if (!existsSync(logDir)) {
        //If there is no log directory create a new one.
        await mkdir(logDir, { recursive: true });
      } else {
        //If there is a log directory delete the existing files inside it
        const files = await readdir(logDir);
        await Promise.all(files.map((file) => unlink(join(logDir, file))));
      }
      //Create a log file for each websocket server
      servers.forEach((server) => {
        const fileName = join(logDir, server.name + ".log");
        const logStream = createWriteStream(fileName, { flags: "a" });
        logWriteStreams[server.name] = logStream;
      });
      resolve(true)
    } catch (err) {
      console.error("Error creating the log folder:", err);
      reject(false)
    }
  });
};

export const logToFile = (serverName: string, data: any): void => {
  logWriteStreams[serverName]?.write(data);
};
