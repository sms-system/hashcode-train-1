import parse from "./parser.mjs"

const input = parse('./in.txt')


const eID = 0

console.log(
    Object.entries(
        input.requests
        .filter(r => r.endpoint.id === eID)
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
)