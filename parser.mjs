import { readFileSync } from 'node:fs'

export default function(filename) {
    const lines = readFileSync(filename, 'utf8').split('\n')

    const endpoints = []
    const requestDescriptions = []
    const caches = []
    
    let cursor = 0
    
    const [videosCount, endpointsCount, requestDescriptionsCount, cachesCount, cachesCapacity] = lines[cursor++].split(' ').map(x => Number(x))
    
    for (let i = 0; i < cachesCount; i++) {
        caches.push({
            cachesCapacity,
        })
    }
    
    const videos = lines[cursor++].split(' ').map(x => ({
        size: Number(x)
    }))
    
    for (let i = 0; i < endpointsCount; i++) {
        const [latency, cachesCount] = lines[cursor++].split(' ')
        const endpoint = {
            latency: Number(latency),
            caches: []
        }
        for (let j = 0; j < Number(cachesCount); j++) {
            const [ cacheID, latency ] = lines[cursor++].split(' ')
            endpoint.caches.push({
                cache: {
                    id: Number(cacheID),
                    data: caches[Number(cacheID)]
                },
                latency: Number(latency)
            })
        }
        endpoints.push(endpoint)
    }
    
    for (let i = 0; i < requestDescriptionsCount; i++) {
        const [videoId, endpointID, count] = lines[cursor++].split(' ')
        const requestDescription = {
            count: Number(count),
            video: {
                id: Number(videoId),
                data: videos[Number(videoId)]
            },
            endpoint: {
                id: Number(endpointID),
                data: endpoints[Number(endpointID)]
            }
        }
        requestDescriptions.push(requestDescription)
    }

    return {
        cachesCapacity,

        videosCount,
        endpointsCount,
        requestDescriptionsCount,
        cachesCount,
    
        endpoints,
        requestDescriptions,
        caches,
        videos
    }
}