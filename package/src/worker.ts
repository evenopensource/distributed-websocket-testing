import { parentPort, threadId } from "worker_threads";
import { TestResult, TestSuite } from "./types";
import {
  addUserHandler,
  removeUserHandler,
  sendMessageHandler,
} from "./function/websocket";
import WebSocket from "ws";

const wsStore: { [k: string]: WebSocket & { evenUserId?: string } } = {};
let receivedMessage: { [k: string]: any[] } = {};

if (parentPort) {
  parentPort.on(
    "message",
    async (input: {
      testSuite: TestSuite;
      serverObj: { [k: string]: number };
    }) => {
      const { testSuite, serverObj } = input;
      let res: { isPassed: boolean; message: string } = {
        isPassed: false,
        message: "",
      };
      for (let testCase of testSuite.testCases) {
        if (testCase.action === "addUser") {
          res = await addUserHandler(
            testCase,
            serverObj,
            wsStore,
            receivedMessage
          );
        } else if (testCase.action === "removeUser") {
          res = await removeUserHandler(testCase, wsStore, receivedMessage);
        } else if (testCase.action === "sendMessage") {
          res = await sendMessageHandler(testCase, wsStore, receivedMessage);
        }
        const testResult: TestResult = {
          testSuiteId: testSuite.id,
          testCaseId: testCase.testId,
          isPassed: res.isPassed,
          message: res.message,
        };
        //Send the message back to the main thread
        parentPort?.postMessage(testResult);
      }
    }
  );
} else {
  console.error("Parent port error");
}
