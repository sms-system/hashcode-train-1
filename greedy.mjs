import parse from "./parser.mjs";
const input = parse('./qualification_round_2017.in/kittens.in.txt')

function solve(input) {
    const utility = input.caches.map(_=> ({}))

    for (let i = 0; i < input.requestsCount; i++) {
        let req = input.requests[i]
        // req.id, req.video, req.endpoint, req.count
        let endpoint = req.endpoint
        for (let j = 0; j < endpoint.data.caches.length; j++) {
            // for each (cache, video) pair compute how much time we save storing video in this cache
            let cacheId = endpoint.data.caches[j].cache.id
            let cacheLatency = endpoint.data.caches[j].latency

            let win = Math.max(0, (endpoint.data.latency - cacheLatency) * req.count)

            if (!(req.video.id in utility[cacheId])) {
                utility[cacheId][req.video.id] = 0
            }
            utility[cacheId][req.video.id] += win
        }
    }

    // next we select best videos for each cache
    for (let i = 0; i < utility.length; ++i) {
        const videosOfThisCache = []
        for (let videoId in utility[i]) {
            videosOfThisCache.push({
                "id" : videoId,
                "utility" : utility[i][videoId],
                "size" : input.videos[videoId].size
            })
        }
        videosOfThisCache.sort((a, b) => b.utility - a.utility); // most useful videos go first
        utility[i].sortedVideos = videosOfThisCache
    }

    // determine best videos for each cache
    const output = []

    for (let i = 0; i < utility.length; ++i) {
        let cacheSize = input.caches[i].cachesCapacity
        let sortedVideos = utility[i].sortedVideos
        let res = []

        for (let video of sortedVideos) {
            cacheSize -= video.size
            if (cacheSize > 0) {
                res.push(video.id)
            } else {
                break
            }
        }
        if (res.length > 0) {
            output.push({
                "cache" : i,
                "videos" : res
            })
        }
    }

    return output
}


function format(output) {
    return `${output.length}\n${output.map(a => `${a.cache} ${a.videos.join(' ')}`).join('\n')}`
 }
 
 console.log(format(solve(input)))
