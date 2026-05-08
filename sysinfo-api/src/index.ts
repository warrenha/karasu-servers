import { serve } from '@hono/node-server'
import app from './app'
import wss from './websocket'

const PORT = 3000

const server = serve({
    fetch: app.fetch,
    port: PORT
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

server.on('upgrade', (req, socket, head) => {
    if (req.url !== '/ws') {
        socket.destroy();
        return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
});
