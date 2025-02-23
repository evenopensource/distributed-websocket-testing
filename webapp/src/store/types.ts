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
};

export type Server = {
    name: string;
    port: number;
};

type ConsumerMessage = {
    users: string[];
    message: any;
};

type TestCaseAddUser = {
    action: "addUser";
    id: string;
    name: string;
    server: string;
    consumedBy: ConsumerMessage[];
};

type TestCaseSendMessage = {
    action: "sendMessage";
    id: string;
    producedBy: {
        name: string;
        message: any;
    };
    consumedBy: ConsumerMessage[];
};

type TestCaseRemoveUser = {
    action: "removeUser";
    id: string;
    name: string;
    consumedBy: ConsumerMessage[];
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

export type TestConfig = {
    repo: Repo;
    servers: Server[];
    testSuites: TestSuite[];
    initScript: string[];
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
};