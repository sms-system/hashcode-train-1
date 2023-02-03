import parse from "./parser.mjs"

const { caches, endpoints } = parse('./in.txt')

console.log(caches[0])
console.log(endpoints[0].caches[0])