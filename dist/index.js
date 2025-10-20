"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSessions = [];
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'join') {
            allSessions.push({ socket: ws, room: parsedMessage.payload.roomId });
        }
        if (parsedMessage.type === 'chat') {
            allSessions.forEach(u => {
                if (u.room === parsedMessage.payload.roomId) {
                    u.socket.send(JSON.stringify({
                        type: 'chat',
                        payload: {
                            message: parsedMessage.payload.message
                        }
                    }));
                }
            });
        }
    });
});
//# sourceMappingURL=index.js.map