import { spawn } from "child_process";

export const dataScript = async(dataScript: string, timeout:number): Promise<void> => {
  const initScriptsArr: string[] = dataScript.split(`\n`);
  initScriptsArr.forEach(command => spawn(command, { stdio: 'inherit', shell: true }))
  return new Promise(resolve => setTimeout(() => resolve(), timeout*1000));
};
