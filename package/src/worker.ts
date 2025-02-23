import { parentPort, threadId } from "worker_threads";
import { TestResult, TestSuite } from "./types";
import {addUserHandler, removeUserHandler, sendMessageHandler} from "./function/websocket"
import WebSocket from "ws";

const wsStore:{[k:string]:WebSocket&{evenUserId?:string}} = {}
const receivedMessage:{[k:string]:any[]} = {}

if (parentPort) {
  parentPort.on("message", async(input:{testSuite: TestSuite, serverObj:{[k:string]:number}}) => {
    const {testSuite, serverObj} = input
    for (let testCase of testSuite.testCases) {
      if(testCase.action === "addUser"){
        await addUserHandler(testCase, serverObj, wsStore, receivedMessage)
      }
      else if(testCase.action === "removeUser"){
        removeUserHandler()
      }
      else if(testCase.action === "sendMessage"){
        sendMessageHandler()
      }
      const testResult: TestResult = {
        testSuiteId: testSuite.id,
        testCaseId: testCase.testId,
        isPassed: true,
        message: "",
      };


      parentPort?.postMessage(testResult);
    }
  });
} else {
  console.error("Parent port error");
}
