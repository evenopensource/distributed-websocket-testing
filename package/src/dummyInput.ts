import { TestConfig } from "./types";
const testConfig: TestConfig = {
  servers: [
    { name: "server-1", port: 8080 },
    { name: "server-2", port: 8081 },
  ],
  repo: {
    name: "Dummy",
    path: "/home/praveen/praveenUnifo/even/demoWsServer/",
    description: "Testing dummy websocket server",
    startCommand: "PORT=$$$$ npm run start",
    isSocketIo: false,
    serverBootTime: 10,
  },
  message: {
    recommendationMessages: {
      student_join: {
        action: "student_join",
        id: "SSN111",
        year: 3,
        section: "A",
        department: "CS",
      },
      professor_join: { action: "professor_join", id: "SSNProf111" },
      professor_broadcast: {
        action: "professor_broadcast",
        stuDepartment: "CS",
        stuYear: 3,
        stuSection: "A",
        message: "hii this is prof SSNProf111",
      },
      student_send: {
        action: "student_send",
        profId: "SSNProf111",
        message: "Hello Prof from SSN222",
      },
    },
    outboundMessageProcessor: {
      code: `const outboundMessageProcessor = (message) => {
  //Converts binary to json
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(message);
  message = JSON.parse(jsonString);
  return message;
};`,
      packages: [],
    },
    inboundMessageProcessor: {
      code: `const inboundMessageProcessor = (message) => {
  //Converts json to binary
  const jsonString = JSON.stringify(message);
  const encoder = new TextEncoder();
  message = encoder.encode(jsonString);
  return message;
};`,
      packages: [],
    },
  },
  testSuites: [
    {
      name: "Test suite 1",
      description:
        "When a student is added/leaves other students should receive message.",
      id: "100",
      testCases: [
        {
          action: "addUser",
          testDescription: "Adding SSN111 to server-1",
          testId: "100-1",
          userName: "SSN111",
          server: "server-1",
          consumedBy: [],
          addUserMessage: {
            action: "student_join",
            id: "SSN111",
            year: 3,
            section: "A",
            department: "CS",
          },
          timeout: 2,
        },
        {
          action: "addUser",
          testId: "100-2",
          testDescription: "Adding SSN222 to server-1",
          userName: "SSN222",
          server: "server-1",
          consumedBy: [
            {
              users: ["SSN111"],
              message: {
                action: "student_join",
                id: "SSN222",
                year: 3,
                section: "A",
                department: "CS",
              },
            },
          ],
          addUserMessage: {
            action: "student_join",
            id: "SSN222",
            year: 3,
            section: "A",
            department: "CS",
          },
          timeout: 2,
        },
        {
          action: "addUser",
          testId: "100-3",
          testDescription: "Adding SSNProf111 to server-1",
          userName: "SSNProf111",
          server: "server-1",
          consumedBy: [],
          addUserMessage: { action: "professor_join", id: "SSNProf111" },
          timeout: 2,
        },
        {
          action: "sendMessage",
          testId: "100-4",
          testDescription:
            "Sending message from SSNProf111 to SSN111 and SSN222",
          timeout: 2,
          producedBy: {
            name: "SSNProf111",
            message: {
              action: "professor_broadcast",
              stuDepartment: "CS",
              stuYear: 3,
              stuSection: "A",
              message: "hii this is prof SSNProf111",
            },
          },
          consumedBy: [
            {
              users: ["SSN111", "SSN222"],
              message: {
                action: "professor_broadcast",
                stuDepartment: "CS",
                stuYear: 3,
                stuSection: "A",
                message: "hii this is prof SSNProf111",
              },
            },
          ],
        },
        {
          action: "removeUser",
          testDescription: "Removing SSN111. This should be notified to SSN222",
          testId: "100-5",
          name: "SSN111",
          timeout: 2,
          consumedBy: [
            {
              users: ["SSN222"],
              message: {
                action: "student_leave",
                id: "SSN111",
                year: 3,
                section: "A",
                department: "CS",
              },
            },
          ],
        },
      ],
    },
  ],
  totalTestCases: 5,
  dataScript: {
    init: `sudo snap start redis
cd /home/praveen/praveenUnifo/even/demoWsServer/httpServerTemp/ && node index.js`,
    cleanUp: `sudo snap stop redis`,
    initTimeout: 5,
    cleanUpTimeout: 5,
  },
};

export default testConfig;
