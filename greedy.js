

function solve(input) {
    utility = new Array(input.caches.length)
    for (let i = 0; i < utility.length; ++i)
        utility[i] = {}

    for (let i = 0; i < input.requests.length; i++) {
        let req = input.requests[i]
        // req.id, req.video, req.endpoint, req.count
        let endpoint = input.endpoints[req.endpoint]
        for (let j = 0; j < endpoint.caches; j++) {
            // for each (cache, video) pair compute how much time we save storing video in this cache
            let cacheId = endpoint.caches[j].id
            let cacheLatency = endpoint.caches[j].latency

            let win = Math.max(0, (endpoint.dcLatency - cacheLatency) * req.count)

            if (!(req.video in utility[endpoint.caches[j].id])) {
                utility[req.caches[j].id][req.video] = 0
            }
            output[req.caches[j].id][req.video] += win
        }
    }

    // next we select best videos for each cache
    for (let i = 0; i < utility.length; ++i) {
        videosOfThisCache = []
        for (let videoId in utility[i]) {
            videosOfThisCache.append({
                "id" : videoId,
                "utility" : utility[videoId],
                "size" : input.videos[videoId].size
            })
        }
        videosOfThisCache.sort((a, b) => b.utility - a.utility); // most useful videos go first
        utility[i].sortedVideos = videosOfThisCache
    }

    // determine best videos for each cache
    output = []

    for (let i = 0; i < utility.length; ++i) {
        let cacheSize = input.caches[i].size
        let sortedVideos = utility[i].sortedVideos
        let res = []
        for (let video in sortedVideos) {
            cacheSize -= video.size
            if (cacheSize > 0) {
                res.append(video.id)
            } else {
                break
            }
        }
        if (res.length > 0) {
            output.append({
                "cache" : i,
                "videos" : res
            })
        }
    }

    return output
}
