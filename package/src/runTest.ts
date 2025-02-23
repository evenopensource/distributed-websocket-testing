import { TestConfig, TestResult, TestSuite } from "./types";
import { Worker } from "worker_threads";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { initLogger } from "./function/initLogger";
import startServer from "./function/startServer";
import { dataScript } from "./function/dataScript";

export class EvenWsTest {
  private readonly testConfig: TestConfig;
  private readonly numThreads: number;
  private workerPool: Worker[];
  private readonly workerPath: string;
  private finalTestResult: TestResult[];
  private mutex: Promise<void>;
  private testSuites: TestSuite[];
  protected serverObj: { [k: string]: number };

  constructor(testConfig: TestConfig) {
    this.testConfig = testConfig;
    this.numThreads =
      os.cpus().length < this.testConfig.testSuites.length
        ? os.cpus().length
        : this.testConfig.testSuites.length;
    this.workerPool = [];
    this.workerPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "./worker.js"
    );
    this.finalTestResult = [];
    this.mutex = Promise.resolve();
    this.testSuites = this.testConfig.testSuites;
    this.serverObj = {};
    this.testConfig.servers.forEach(
      (server) => (this.serverObj[server.name] = server.port)
    );
  }

  public async run(
    callbackFn: (testResult: TestResult) => any
  ): Promise<TestResult[]> {
    //Creating the necessary log files
    console.log("Creating logger files");
    await initLogger(this.testConfig.servers);
    if (!initLogger) {
      throw new Error("Internal Error: Error while initializing the logger");
    }

    //Run the init script
    console.log("Running Init Data Scripts");
    await dataScript(
      this.testConfig.dataScript.init,
      this.testConfig.dataScript.initTimeout
    );

    //Start the websocket servers
    console.log("Starting the websocket servers");
    const serverBootPromises: Promise<void>[] = [];
    this.testConfig.servers.forEach((server) => {
      const startCommand: string = this.testConfig.repo.startCommand.replace(
        "$$$$",
        `${server.port}`
      );
      serverBootPromises.push(
        startServer(
          server.name,
          this.testConfig.repo.path,
          startCommand,
          this.testConfig.repo.serverBootTime
        )
      );
    });
    await Promise.all(serverBootPromises);

    //Create the worker threads and execute the test suites.
    console.log("Executing the test suites");
    const testResults: TestResult[] = await this.createWorkers(callbackFn);

    //Run the cleanUp script
    console.log("Running the clean up scripts");
    await dataScript(
      this.testConfig.dataScript.cleanUp,
      this.testConfig.dataScript.cleanUpTimeout
    );

    //Terminate all the worker threads
    this.workerPool.forEach(async (worker: Worker) => {
      await worker.terminate();
    });

    return testResults;
  }

  private async assignTask(worker: Worker): Promise<void> {
    //Mutex is used to ensure test cases are synchronously assigned to the worker threads. Here mutex is implemented using the sequential execution pattern using promises in node js
    this.mutex = this.mutex
      .then(async () => {
        const testSuite: TestSuite | undefined = this.testSuites.shift();
        if (testSuite) {
          worker.postMessage({ testSuite, serverObj: this.serverObj });
        }
        // else {
        // console.log("No test suite to assign to the worker");
        // }
      })
      .catch((err) => {
        console.error("Error when assigning task to the worker threads");
      });

    return this.mutex;
  }

  private async createWorkers(
    callbackFn: (testResult: TestResult) => any
  ): Promise<TestResult[]> {
    return new Promise((res) => {
      for (let i = 0; i < this.numThreads; i++) {
        const worker: Worker = new Worker(this.workerPath);
        this.workerPool.push(worker);
        worker.on("message", (testResult: TestResult) => {
          callbackFn(testResult);
          this.finalTestResult.push(testResult);
          if (this.finalTestResult.length === this.testConfig.totalTestCases) {
            res(this.finalTestResult);
          }
          this.assignTask(worker);
        });

        worker.on("error", (error) => {
          console.error(
            "Worker Thread: Error while processing the test suite",
            error
          );
        });

        this.assignTask(worker);
      }
    });
  }
}
