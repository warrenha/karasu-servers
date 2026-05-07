//import { upgradeWebSocket } from '@hono/node-server'
import { WebSocketServer } from 'ws'
import { Hono } from 'hono'

const wss = new WebSocketServer({ noServer: true })

wss.on('connection', (ws, req) => {
    console.log('client connected')

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
    })
})

export default wss
