import { WebSocketServer, type WebSocket } from 'ws'
import { Hono } from 'hono'
import { getCpuTemperature } from './utils/SystemInfo'

const Interval_10s = 10000

const wss = new WebSocketServer({ noServer: true })

const clients = new Set<any>();

wss.on('connection', (ws, req) => {
    console.log('client connected')
    clients.add(ws);

    ws.on('message', (message) => {
        console.log(message.toString())
        ws.send(
            JSON.stringify({
                type: 'echo',
                payload: message.toString(),
            })
        )
    })

    ws.on('close', () => {
        console.log('client disconnected')
        clients.delete(ws);
    })
})

setInterval(async () => {
    try {
        if (clients.size === 0) { return }
        console.log(`Client count: ${clients.size}`)

        const cpu = await getCpuTemperature();

        const payload = JSON.stringify({
            type: 'system.cpu.temperature',
            payload: {
                main: cpu.main,
                cores: cpu.cores,
                max: cpu.max
            },
        });

        for (const client of clients) {
            if (client.readyState === client.OPEN) {
                client.send(payload);
            }
        }
    }
    catch(err) {
        console.error('Error sending cpu temperatures:')
        console.error(err)
    }
}, Interval_10s);

export default wss
