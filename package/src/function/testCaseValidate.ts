import {
  TestCaseAddUser,
  TestCaseSendMessage,
  TestCaseRemoveUser,
} from "../types";
export const testCaseValidate = async (
  testCase: TestCaseAddUser | TestCaseSendMessage | TestCaseRemoveUser,
  receivedMessage: { [k: string]: any[] },
  result: { isPassed: boolean; message: string }
): Promise<{ isPassed: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
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
          if (index === -1) {
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
        //Clear the receivedMessage
        Object.keys(receivedMessage).forEach(user => {
            delete receivedMessage[user];
        });
        receivedMessage = {}
        resolve(result);
      }
    }, testCase.timeout * 1000);
  });
};
