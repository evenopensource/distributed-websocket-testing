import WebSocket from "ws";
import { TestCaseAddUser } from "../../types";
import { testCaseValidate } from "../testCaseValidate";

export const addUserHandler = async (
  testCase: TestCaseAddUser,
  serverObj: { [k: string]: number },
  wsStore: { [k: string]: WebSocket & { evenUserId?: string } },
  receivedMessage: { [k: string]: any[] }
): Promise<{ isPassed: boolean; message: string }> => {
  let result: { isPassed: boolean; message: string } = {
    isPassed: false,
    message: "",
  };
  try {
    const ws: WebSocket & { evenUserId?: string } = new WebSocket(
      `ws://localhost:${serverObj[testCase.server]}`
    );
    ws["evenUserId"] = testCase.userName;
    ws.on("error", console.error);

    ws.on("open", function open() {
      if (testCase.addUserMessage) {
        //MP
        ws.send(JSON.stringify(testCase.addUserMessage));
      }
      wsStore[testCase.userName] = ws;
    });

    //   ws.on("close", function close() {
    //     console.log(`disconnected websocket connection for ${ws.evenUserId}`);
    //   });

    ws.on("message", function message(dataBuffer) {
      //Converting from buffer to string
      let data = dataBuffer.toString();
      //MP
      data = JSON.parse(data);
      if (ws.evenUserId && receivedMessage[ws.evenUserId]) {
        receivedMessage[ws.evenUserId] = [
          ...receivedMessage[ws.evenUserId],
          data,
        ];
      } else if (ws.evenUserId) {
        receivedMessage[ws.evenUserId] = [data];
      }
    });
  } catch (error) {
    console.log("Error during addUserHandler", error);
    result.message = "Internal error(addUserHandler)";
  }
  const testRes: Promise<{ isPassed: boolean; message: string }> =
    testCaseValidate(testCase, receivedMessage, result);
  return testRes;
};
