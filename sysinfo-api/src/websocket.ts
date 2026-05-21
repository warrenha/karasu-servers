import { WebSocketServer, type WebSocket } from 'ws'
import { Hono } from 'hono'
import { getCpuTemperatureForWs, getCurrentLoadForWs } from './utils/SystemInfo'

const Interval = 10000
const Heartbeat = 30000

const wss = new WebSocketServer({ noServer: true })

// - - - - - Types - - - - - //

type AliveWebSocket = WebSocket & {
    isAlive: boolean
}

type Payload = {
    type: string,
    payload: { [key: string]: any }
}

// - - - - - Send to Clients - - - - - //

const clients = new Set<AliveWebSocket>()

const getSystemPayload = async (): Promise<Payload> => {
    const cpu = await getCpuTemperatureForWs()

    const load = await getCurrentLoadForWs()

    const payload = {
        type: 'system.cpu.temperature',
        payload: {
            cpu,
            load
        }
    }
    return payload
}

const sendToClients = async (payload: Payload) => {
    console.log(`Client count: ${clients.size}`)

    const body = JSON.stringify(payload)

    for (const client of clients) {
        if (client.readyState === client.OPEN) {
            client.send(body)
        }
    }
}

const queryAndSendToClients = async () => {
    const payload = await getSystemPayload()  // Payload

    sendToClients(payload)
}

// - - - - - Interval - - - - - //

let interval: NodeJS.Timeout | null = null

const startInterval = () => {
    if (interval) return
    console.log('Starting system polling')

    interval = setInterval(async () => {
        try {
            queryAndSendToClients()
        }
        catch(err) {
            console.error('Error sending cpu temperatures:')
            console.error(err)
        }
    }, Interval)
}

const stopInterval = () => {
    if (!interval) return
    console.log('Stopping system polling')

    clearInterval(interval)
    interval = null
}

// - - - - - Heartbeat - - - - - //

let heartbeat: NodeJS.Timeout | null = null

const startHeartbeat = () => {
    if (heartbeat) return
    console.log('Starting heartbeat')

    heartbeat = setInterval(() => {
        for (const client of clients) {
            if (!client.isAlive) {
                console.log('Terminating dead socket')

                clients.delete(client)
                client.terminate()
                continue
            }
            console.log('Sending ping')
            client.isAlive = false
            client.ping()
        }
    }, Heartbeat)
}

const stopHeartbeat = () => {
    if (!heartbeat) return
    console.log('Stopping heartbeat')

    clearInterval(heartbeat)
    heartbeat = null
}

// - - - - - WebSocket - - - - - //

wss.on('connection', (_ws: WebSocket, req) => {
    console.log('client connected')
    const ws = _ws as AliveWebSocket
    ws.isAlive = true
    clients.add(ws)

    // Send immediately, rather than wait for interval.
    queryAndSendToClients()

    if (clients.size === 1) {
        startInterval()
        startHeartbeat()
    }

    ws.on('pong', () => {
        console.log('Received pong')
        ws.isAlive = true
    })

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
        clients.delete(ws)
        if (clients.size === 0) {
            stopInterval()
            stopHeartbeat();
        }
    })
})

export default wss
