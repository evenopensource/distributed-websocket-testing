export {EvenWsTest} from "./runTest";
export * from "./types";
import testConfig from "./dummyInput";
import {EvenWsTest} from "./runTest" 
import { TestResult } from "./types";



const indexFunc = async() => {
    const a = new EvenWsTest(testConfig)
    const callbackFn: (testResult: TestResult) => void = (testResult) => console.log(`Test suite: ${testResult.testSuiteId} || Test Case: ${testResult.testCaseId} || Status: ${testResult.isPassed? "Passed" : "Failed"} || Message: ${testResult.message}`)
    const result = await a.run(callbackFn)
    console.log("Test Report", result)
}

indexFunc()