import parseInput from "./parser.mjs";
import path from "node:path";
import { readFileSync } from 'node:fs'

const inFilePath = path.resolve(process.cwd(), process.argv[2]);
const outFilePath = path.resolve(process.cwd(), process.argv[3]);

function parseOutput(outputPath) {
    const lines = readFileSync(outputPath, 'utf-8').split('\n');
    const n = Number(lines[0]);

    const result = new Map();

    for (let i = 1; i <= n; i++) {
        const [ id, ...videoIds ] = lines[i].split(' ').map(Number);
        result.set(id, new Set(videoIds));
    }

    return result;
}

function calculateScore(inputPath, outputPath) {
    const input = parseInput(inputPath);
    const output = parseOutput(outputPath);

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

console.log(calculateScore(inFilePath, outFilePath));
