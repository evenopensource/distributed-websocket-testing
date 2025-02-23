import { TestCaseSendMessage } from "../../types";
import { testCaseValidate } from "../testCaseValidate";
import WebSocket from "ws";

export const sendMessageHandler = async (
  testCase: TestCaseSendMessage,
  wsStore: { [k: string]: WebSocket & { evenUserId?: string } },
  receivedMessage: { [k: string]: any[] }
): Promise<{ isPassed: boolean; message: string }> => {
  let result: { isPassed: boolean; message: string } = {
    isPassed: false,
    message: "",
  };
  try {
    const userWsConnection: WebSocket & { evenUserId?: string } =
      wsStore[testCase.producedBy.name];
    userWsConnection.send(JSON.stringify(testCase.producedBy.message));
  } catch (error) {
    console.log(
      "Internal Error: Unable to send message: ",
      testCase.producedBy.name,
      error
    );
  }
  const testRes: Promise<{ isPassed: boolean; message: string }> =
    testCaseValidate(testCase, receivedMessage, result);
  return testRes;
};
