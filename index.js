const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Serve static files (e.g., stylesheets, images, scripts) from the "public" directory
app.use(express.static("public"));

// Define a route to serve your HTML page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// WebSocket server
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

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
