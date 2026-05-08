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
        console.debug(data)
        return data;
    })
}
