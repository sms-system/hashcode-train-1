const fs = require("fs");

const createCacheServersVideosMap = function(data) {
    let map = new Map();

    data.forEach(cacheServerData => {
        const parsedData = cacheServerData.split(' ').map(num => Number(num));
        const serverNumber = Number(parsedData.shift());
        const videosArrayInServer = parsedData;

        map.set(serverNumber, videosArrayInServer);
    });

    return map;
}

const MICROSECONDS_MULTIPLIER = 1000;
const path = "./example-output.txt";
let data;

try {
    data = fs.readFileSync(path, "utf8");

    console.log('----------DATA----------');
    console.log(data);
    console.log('----------DATA----------');
} catch (err) {
    console.log('----------ERROR----------');
    console.error(err);
    console.log('----------ERROR----------');
}

const splittedData = data.split(/\r?\n/);
const CACHE_SERVERS_COUNT = splittedData.shift();
console.log('CACHE_SERVERS_COUNT:', CACHE_SERVERS_COUNT)

const cacheServersVideosMap = createCacheServersVideosMap(splittedData);
console.log('cacheServersVideosMap:', cacheServersVideosMap)










return MICROSECONDS_MULTIPLIER;


