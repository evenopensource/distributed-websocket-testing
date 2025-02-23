const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
});

const PORT = 7991;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});