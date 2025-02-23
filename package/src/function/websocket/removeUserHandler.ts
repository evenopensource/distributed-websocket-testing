import { TestCaseRemoveUser } from "../../types";
import { testCaseValidate } from "../testCaseValidate";
import WebSocket from "ws";

export const removeUserHandler = async (
  testCase: TestCaseRemoveUser,
  wsStore: { [k: string]: WebSocket & { evenUserId?: string } },
  receivedMessage: { [k: string]: any[] }
): Promise<{ isPassed: boolean; message: string }> => {
  let result: { isPassed: boolean; message: string } = {
    isPassed: false,
    message: "",
  };
  try {
    const userWsConnection: WebSocket & { evenUserId?: string } =
      wsStore[testCase.name];
    userWsConnection.close();
  } catch (error) {
    console.log(
      "Internal Error: Unable to remove user: ",
      testCase.name,
      error
    );
  }
  const testRes: Promise<{ isPassed: boolean; message: string }> =
    testCaseValidate(testCase, receivedMessage, result);
  return testRes;
};
