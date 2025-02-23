import WebSocket from "ws";
import { TestCaseAddUser } from "../../types";

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
  return new Promise((resolve, reject) => {
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

      ws.on("close", function close() {
        console.log(`disconnected websocket connection for ${ws.evenUserId}`);
      });

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
      reject(result);
    }
    setTimeout(() => {
      //check all the positive cases
      testCase.consumedBy.forEach((consumedBy) => {
        for (let user of consumedBy.users) {
          let index = -1;
          //   for(let msg of receivedMessage[user]){
          for (let i = 0; i < receivedMessage[user]?.length; i++) {
            const msg = receivedMessage[user][i];
            if (
              msg &&
              JSON.stringify(msg) === JSON.stringify(consumedBy.message)
            )
              index = i;
          }
          if (index === -1 ) {
            //If the consumedBy message is not available in the receivedBy array it means the user has not received the message. Test case has failed
            result.isPassed = false;
            result.message = `${user} did not receive the message ${consumedBy.message}`;
            resolve(result);
          }
          //remove the message
          receivedMessage[user]?.splice(index, 1);
          if (receivedMessage[user]?.length === 0) {
            delete receivedMessage[user];
          }
        }
      });
      //Check for the negative case: If the receivedMessage object is empty it means no extra user has received the message
      if (Object.keys(receivedMessage).length === 0) {
        result.isPassed = true;
        result.message = `Test case passed successfully`;
        resolve(result);
      } else {
        result.isPassed = false;
        const extraUser = Object.keys(receivedMessage).join(", ");
        result.message = `Message should not be received by ${extraUser}`;
        resolve(result);
      }
    }, testCase.timeout * 1000);
  });
};
