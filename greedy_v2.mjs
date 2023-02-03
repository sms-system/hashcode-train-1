const input = {
    "cachesCapacity":100,
    "videosCount":5,
    "endpointsCount":2,
    "requestsCount":4,
    "cachesCount":3,
    "endpoints":[
       {
          "latency":1000,
          "caches":[
             {
                "cache":{
                   "id":0,
                   "data":{
                      "cachesCapacity":100
                   }
                },
                "latency":100
             },
             {
                "cache":{
                   "id":2,
                   "data":{
                      "cachesCapacity":100
                   }
                },
                "latency":200
             },
             {
                "cache":{
                   "id":1,
                   "data":{
                      "cachesCapacity":100
                   }
                },
                "latency":300
             }
          ]
       },
       {
          "latency":500,
          "caches":[
             
          ]
       }
    ],
    "requests":[
       {
          "count":1500,
          "video":{
             "id":3,
             "data":{
                "size":30
             }
          },
          "endpoint":{
             "id":0,
             "data":{
                "latency":1000,
                "caches":[
                   {
                      "cache":{
                         "id":0,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":100
                   },
                   {
                      "cache":{
                         "id":2,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":200
                   },
                   {
                      "cache":{
                         "id":1,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":300
                   }
                ]
             }
          }
       },
       {
          "count":1000,
          "video":{
             "id":0,
             "data":{
                "size":50
             }
          },
          "endpoint":{
             "id":1,
             "data":{
                "latency":500,
                "caches":[
                   
                ]
             }
          }
       },
       {
          "count":500,
          "video":{
             "id":4,
             "data":{
                "size":110
             }
          },
          "endpoint":{
             "id":0,
             "data":{
                "latency":1000,
                "caches":[
                   {
                      "cache":{
                         "id":0,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":100
                   },
                   {
                      "cache":{
                         "id":2,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":200
                   },
                   {
                      "cache":{
                         "id":1,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":300
                   }
                ]
             }
          }
       },
       {
          "count":100,
          "video":{
             "id":1,
             "data":{
                "size":50
             }
          },
          "endpoint":{
             "id":0,
             "data":{
                "latency":1000,
                "caches":[
                   {
                      "cache":{
                         "id":0,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":100
                   },
                   {
                      "cache":{
                         "id":2,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":200
                   },
                   {
                      "cache":{
                         "id":1,
                         "data":{
                            "cachesCapacity":100
                         }
                      },
                      "latency":300
                   }
                ]
             }
          }
       }
    ],
    "caches":[
       {
          "cachesCapacity":100
       },
       {
          "cachesCapacity":100
       },
       {
          "cachesCapacity":100
       }
    ],
    "videos":[
       {
          "size":50
       },
       {
          "size":50
       },
       {
          "size":80
       },
       {
          "size":30
       },
       {
          "size":110
       }
    ]
 }


function getCacheScore(video, endpoint, cache) {
    return cache.latency
}
function getEndpointLoad(ep) {
    return 0
}

function solve(input) {
    input.endpoints.forEach(el => el.load = getEndpointLoad(el));
    input.endpoints.forEach(el => el.videos = {});
    sortedEndpoints = input.endpoints.map(x => x)
    sortedEndpoints.sort((a, b) => b.load - a.load);

    input.caches.forEach(c => c.videos = [])
    input.caches.forEach(c => c.remainingCapacity = c.cachesCapacity)

    for (const endpoint of sortedEndpoints) {
        for (const video of endpoint.sortedVideos) {
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


console.log(solve(input))
