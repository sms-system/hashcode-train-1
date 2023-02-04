import parse from "./parser.mjs"
import score from './score2.mjs'
import path from "node:path"
 
const inFilePath = path.resolve(process.cwd(), process.argv[2]);

const input = parse(inFilePath)


function getCacheScore(video, endpoint, cache) {
    return -cache.latency
}

function getEndpointLoad(ep) {
   return Math.random()
   //  return input.requests
   //    .filter(r => r.endpoint.id === ep.id)
   //    .reduce((acc, r) => acc + r.count, 0)
}

function getSortedVideos(ep) {
   return Object.entries(
       input.requests
       .filter(r => r.endpoint.id === ep.id)
       .reduce((acc, r) => {
           acc[r.video.id] = acc[r.video.id] ? r.count + acc[r.video.id] : r.count
           return acc
       }, {})
   )
   .sort((a, b) => (b[1] - a[1]))
   .map(a => ({
       id: a[0],
       data: input.videos[a[0]]
   }))
}

function solve(input) {
    input.endpoints.forEach(el => el.load = getEndpointLoad(el));
    input.endpoints.forEach(el => el.videos = {});
    const sortedEndpoints = input.endpoints.map(x => x)
    sortedEndpoints.sort((a, b) => b.load - a.load);

    input.caches.forEach(c => c.videos = [])
    input.caches.forEach(c => c.remainingCapacity = c.cachesCapacity)


    for (const endpoint of sortedEndpoints) {
        for (const video of getSortedVideos(endpoint)) {
            let bestCache = null
            let bestScore = null
            for (const cache of endpoint.caches) {
                if (cache.cache.data.remainingCapacity < video.data.size)
                    continue;

                let score = getCacheScore(video, endpoint, cache)
                if (bestCache == null || score > bestScore || score == bestScore && cache.cache.data.remainingCapacity < bestCache.cache.data.remainingCapacity) {
                    bestCache = cache
                    bestScore = score
                }
            }
            if (bestCache != null) {
                bestCache.cache.data.remainingCapacity -= video.data.size
                bestCache.cache.data.videos.push(video.id)
            }
        }
    }

    let output = []
    for (const cache of input.caches) {
        if (cache.videos.length > 0) {
            // TODO remove duplicates from videos
            output.push({
                "cache" : cache.id,
                "videos" : cache.videos
            })
        }
    }

    return output
}

function format(output) {
   return `${output.length}\n${output.map(a => `${a.cache} ${a.videos.join(' ')}`).join('\n')}`
}

console.log(score(input, format(solve(input))))