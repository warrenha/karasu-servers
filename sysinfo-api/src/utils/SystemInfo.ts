import si from 'systeminformation'


/*
 * Gets information about the CPU, e.g., manufacturer, brand, and # cores.
 *
 * https://systeminformation.io/cpu.html
 */
export const getCpu = async () => {
    console.debug('cpu')

    return si.cpu().then(data => {
        console.debug(data)
        return data;
    })
}

/*
 * Gets temperatures for the CPU & cores.
 *
 * https://systeminformation.io/cpu.html
 */
export const getCpuTemperature = async () => {
    console.debug('cpuTemperature')

    return si.cpuTemperature().then(data => {
        //console.debug(data)
        return data;
    })
}

/*
 * Simpler object than getCpuTemperature, for WebSocket payload.
 */
export const getCpuTemperatureForWs = async () => {
    return getCpuTemperature().then(d => ({
        main: d.main,
        cores: d.cores,
        max: d.max
    }))
}

/*
 * Gets current system load.
 *
 * https://systeminformation.io/processes.html
 */
export const getCurrentLoad = async () => {
    console.debug('currentLoad')

    return si.currentLoad().then(data => {
        //console.debug(data)
        return data;
    })
}

/*
 * Simpler object than getCurrentLoad, for WebSocket payload.
 */
export const getCurrentLoadForWs = async () => {
    return getCurrentLoad().then(d => ({
        load: d.currentLoad,
        loadUser: d.currentLoadUser,
        loadSystem: d.currentLoadSystem,
        cpus: (d.cpus || []).map(c => ({
            load: c.load,
            loadUser: c.loadUser,
            loadSystem: c.loadSystem
        }))
    }))
}
