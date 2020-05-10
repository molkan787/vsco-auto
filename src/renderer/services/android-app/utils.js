const fs = require('fs');
const MemoryStream = require('memorystream');

export function writeStreamToFile(stream, filename) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filename);
        stream.pipe(writeStream);
        stream.on('error', reject);
        stream.on('end', resolve);
    })
}

export function streamToString(source) {
    const chunks = []
    return new Promise((resolve, reject) => {
        const pStream = new MemoryStream();
        pStream.on('data', chunk => chunks.push(chunk))
        pStream.on('error', reject)
        pStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        source.pipe(pStream);
    })
}

export function sleep(time){
    return new Promise(resolve => setTimeout(resolve, time));
}