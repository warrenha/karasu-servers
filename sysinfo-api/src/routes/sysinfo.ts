import { Hono } from 'hono'
import { getCpu, getCpuTemperature, getCurrentLoad }
    from '../utils/SystemInfo'

/*
 * Endpoints for the '/sysinfo' path.
 *
 * Gets CPU details (model, number of cores, etc.) and core temps.
 */
const sysinfo = new Hono()

sysinfo.get('/cpu', async (c) => {
    const cpu = await getCpu()
    return c.json(cpu)
})

sysinfo.get('/cpuTemperature', async (c) => {
    const cpu = await getCpuTemperature()
    return c.json(cpu)
})

sysinfo.get('/currentLoad', async (c) => {
    const cpu = await getCurrentLoad()
    return c.json(cpu)
})

export default sysinfo
