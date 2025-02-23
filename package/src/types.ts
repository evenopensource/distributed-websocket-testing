type Cookie = {
  name: string;
  value: string;
};
type Repo = {
  name: string;
  path: string;
  description: string;
  startCommand: string;
  isSocketIo: boolean;
  serverBootTime: number;
};

export type Server = {
  name: string;
  port: number;
};

type ConsumerMessage = {
  users: string[];
  message: any;
};

export type TestCaseAddUser = {
  action: "addUser";
  testId: string;
  testDescription:string;
  userName: string;
  server: string;
  addUserMessage: any;
  consumedBy: ConsumerMessage[];
  timeout: number
};

type TestCaseSendMessage = {
  action: "sendMessage";
  testId: string;
  testDescription:string;
  producedBy: {
    name: string;
    message: any;
  };
  consumedBy: ConsumerMessage[];
  timeout: number
};

type TestCaseRemoveUser = {
  action: "removeUser";
  testDescription:string;
  testId: string;
  name: string;
  consumedBy: ConsumerMessage[];
  timeout: number
};

type TestCase = (TestCaseAddUser | TestCaseSendMessage | TestCaseRemoveUser)[];

export type TestSuite = {
  name: string;
  id: string;
  description: string;
  testCases: TestCase;
};

type Message = {
  recommendationMessages: { [key: string]: any };
  outboundMessageProcessor: {
    code: string;
    packages: string[];
  };
  inboundMessageProcessor: {
    code: string;
    packages: string[];
  };
};

export type DataScript = {
  init: string;
  cleanUp: string;
  initTimeout: number;
  cleanUpTimeout: number;
};

export type TestConfig = {
  repo: Repo;
  servers: Server[];
  testSuites: TestSuite[];
  dataScript: DataScript;
  totalTestCases: number;
  message: Message;
};

export type TestResult = {
  testSuiteId: string;
  testCaseId: string;
  isPassed: boolean;
  message: string;
};

export type Config = {
  appName: string;
  logDirPath: string;
  platform: "windows" | "mac" | "linux";
  tempDirPath: string;
};

