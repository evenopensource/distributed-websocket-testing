import { create } from "zustand";
import { TestConfig } from "./types";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

export const Template: TestConfig = {
  servers: [],
  repo: {
    name: "",
    path: "",
    description: "",
    startCommand: "",
    isSocketIo: true,
  },
  message: {
    recommendationMessages: {
      student_join: {
        action: "",
        id: "",
        year: 0,
        section: "",
        department: "",
      },
      professor_join: { action: "", id: "" },
      professor_broadcast: {
        action: "",
        stuDepartment: "",
        stuYear: 0,
        stuSection: "",
        message: "",
      },
      student_send: {
        action: "",
        profId: "",
        message: "",
      },
    },
    outboundMessageProcessor: {
      code: `const outboundMessageProcessor = (message) => {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(message);
  message = JSON.parse(jsonString);
  return message;
};`,
      packages: [],
    },
    inboundMessageProcessor: {
      code: `const inboundMessageProcessor = (message) => {
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
      name: "",
      description: "",
      id: "",
      testCases: [
        {
          action: "addUser",
          testDescription: "",
          testId: "",
          userName: "",
          server: "",
          consumedBy: [],
          addUserMessage: {},
          timeout: 0,
        },
      ],
    },
  ],
  totalTestCases: 0,
  dataScript: {
    init: "",
    cleanUp: "",
    initTimeout: 0,
    cleanUpTimeout: 0,
  },
};


interface TestConfigState {
  testConfig: TestConfig;
  updateTestConfig: (newConfig: Partial<TestConfig>) => void;
  onFieldChange: (value: any, path: string, key: string) => void;
  clearTestSuites: () => void
  selectedTestSuiteIndex: number | null;
  setSelectedTestSuite: (index: number) => void;
}

export const useTestConfigStore = create<TestConfigState>((set) => ({
  testConfig: JSON.parse(JSON.stringify(Template)),

  updateTestConfig: (newConfig) =>
    set((state) => ({
      testConfig: merge({}, state.testConfig, newConfig), // Deep merge fix
    })),

  clearTestSuites: () =>
    set((state) => ({
      testConfig: { ...state.testConfig, testSuites: [], totalTestCases: 0 }, // Reset totalTestCases fix
    })),

  onFieldChange: (value, path, key) => {
    set((state) => {
      const updatedConfig = cloneDeep(state.testConfig); // Deep clone fix
      const keys = path.split(".");
      let current: any = updatedConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (key === "length" && Array.isArray(current[lastKey])) {
        let arr = current[lastKey];
        value = parseInt(value || 0, 10);
        if (arr.length < value) {
          while (arr.length < value) {
            arr.push({ server: "", port: "" });
          }
        } else if (arr.length > value) {
          arr.splice(value);
        }
      } else {
        if (typeof current[lastKey] === "object" && current[lastKey] !== null) {
          current[lastKey][key] = value;
        } else {
          current[lastKey] = { [key]: value };
        }
      }

      return { testConfig: updatedConfig };
    });
  },

  selectedTestSuiteIndex: 0, // Fix: Proper state key
  setSelectedTestSuite: (index) => set({ selectedTestSuiteIndex: index }), // Fix: Update correct state key
}));



