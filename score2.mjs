function parseOutput(output) {
    const lines = readFileSync(outputPath, 'utf-8').split('\n');
    const n = Number(lines[0]);

    const result = new Map();

    for (let i = 1; i <= n; i++) {
        const [ id, ...videoIds ] = lines[i].split(' ').map(Number);
        result.set(id, new Set(videoIds));
    }

    return result;
}

export default function(input, outputStr) {
    const output = parseOutput(outputStr);

    let savedTime = 0;
    let totalRequestAmount = 0;

    for (const { video, endpoint, count } of input.requests) {
        let bestLatency = endpoint.data.latency;
        for (const { cache, latency } of endpoint.data.caches) {
            if (output.has(cache.id) && output.get(cache.id).has(video.id)) {
                bestLatency = Math.min(bestLatency, latency);
            }
        }

        savedTime += count * (endpoint.data.latency - bestLatency);
        totalRequestAmount += count;
    }

    return Math.floor(savedTime * 1000 / totalRequestAmount);
};
