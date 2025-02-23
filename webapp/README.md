# EvenWsTest

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.7-blue)

A TypeScript-based npm package and web application to run test cases for distributed WebSocket servers. This tool helps in load testing, connection stability checks, and real-time message validation across multiple WebSocket instances.

## Overview

### Project Description and Purpose
EvenWsTest is designed to facilitate the testing of distributed WebSocket servers. It allows users to simulate multiple WebSocket clients, send and receive messages in real-time, and validate server responses. The project includes both a backend npm package and a frontend web application for managing and running test configurations.

### Key Features and Functionality
- Simulate multiple WebSocket clients.
- Send and receive messages in real-time.
- Validate server responses.
- Support for distributed WebSocket environments.
- Customizable test scripts.
- Detailed logs and metrics.
- Web interface for creating and managing test configurations.

## Installation

### Prerequisites and Dependencies
- Node.js >= 16
- TypeScript >= 4.7


### Frontend (web application)
1. Access the web application at `http://localhost:3000`.
2. Use the interface to create and manage test configurations.
3. Export the test configurations as JSON files.

## Contributing

### Guidelines for Contributing
- Fork the repository.
- Create a new branch for your feature or bugfix.
- Commit your changes and push them to your fork.
- Create a pull request with a detailed description of your changes.

### Development Setup
1. Clone the repository:
    ```sh
    git clone https://github.com/evenopensource/distributed-websocket-testing.git
    cd distributed-websocket-testing
    ```

2. Install dependencies for both backend and frontend:
    ```sh
    cd package
    npm install
    cd ../webapp
    npm install
    ```

3. Start the development servers:
    ```sh
    cd ../package
    npm run dev
    cd ../webapp
    npm run dev
    ```

### Testing Instructions
- Ensure all tests pass before submitting a pull request.
- Write unit tests for new features and bug fixes.

## License

This project is licensed under the MIT License.

## Authors