import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSessions: User[] = [];

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);

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
