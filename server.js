const WebSocket = require("ws");
const http = require("http");
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server running");
});

const wss = new WebSocket.Server({ server });

let visitorCount = 0;

wss.on("connection", (ws) => {
    visitorCount++;
    ws.send(visitorCount.toString());

    ws.on("close", () => {
        visitorCount--;
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(visitorCount.toString());
            }
        });
    });
});

server.listen(3000, () => {
    console.log("WebSocket server is running on port 3000");
});
