# EvenWsTest

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.7-blue)

A TypeScript-based testing framework for distributed webSocket servers.

## Repo details
- `package` contains the code that executes the test case and check if the web-socket servers behaves as intended
- `webapp` is a webapp that can be used to create the test suites and test cases
- `demoWsServer` a dummy websocket server that can be used for testing
  
## Features

- Can be used to test distributed websocket servers written in any language.
- Has a webapp using which test suites and test cases can be created easily.
- Has data scripts using which the necessary tools(redis pubsub/db/any http server) that supports the websocket server can be started automatically at the start of the test case. 
- Starts multiple websocket servers and server logs can be found in the "log" directory of the respective OS
- Simulates websocket add user, send message and remove user and checks if the websocket server behaves as intended
- Supports parallel execution of multiple test suites



## Installation and start
Install the dependencies `npm install`
Build and run `npm run build && npm run dev`



## Contributing

Feel free to submit issues and pull requests! Contributions are always welcome.

## License

This project is licensed under the MIT License.
