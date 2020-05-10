const electron = require('electron')
const dialog = electron.dialog
const fs = require('fs')

export function isDigit(char){
    return char !== '' && '0123456789'.includes(char)
}

export function timestamp(){
    return Math.floor(new Date().getTime() / 1000);
}

export function p(executor) {
    return new Promise(executor);
}

export function waitUntil(checker, interval) {
    return new Promise(resolve => {
        const timer = setInterval(() => {
            if (checker()) {
                clearInterval(timer);
                resolve()
            }
        }, interval || 20)
    })
}

export function rndSleep(min, max) {
    return sleep(rnd(min, max))
}

export function sleep(time) {
    return new Promise(r => setTimeout(() => r(), time))
}

export function rnd(min, max) {
    const rn = Math.random()
    return min + Math.floor((max - min) * rn)
}

export function rndItem(arr) {
    const index = Math.round(Math.random() * (arr.length - 1))
    return arr[index]
}

export async function delay(executor, time){
    await sleep(time)
    return await executor()
}

export function divideArray(array, divider) {
    const result = [];
    for (let i = 0; i < array.length; i += divider) {
        result.push(array.slice(i, i + divider));
    }
    return result;
}

export function splitArray(arr, count){
    const chunks = []
    const chunkSize = Math.floor(arr.length / count)
    const rest = arr.length % count
    let index = 0
    for(let i = 0; i < count; i++){
        const size = chunkSize + (i < rest ? 1 : 0)
        chunks.push(arr.slice(index, index + size))
        index += size
    }
    return chunks
}

export function textCompare(t1, t2){
    return uglifyText(t1) == uglifyText(t2);
}

export function uglifyText(text){
    return text.toLowerCase().replace(/\s/g, '');
}

export async function promptDirectory() {
    const resp = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    if (resp.canceled) return null

    return resp.filePaths[0]
}

export async function promptFile() {
    const resp = await dialog.showOpenDialog()
    if (resp.canceled) return null

    return resp.filePaths[0]
}

export async function promptSaveFile() {
    const resp = await dialog.showSaveDialog()
    if (resp.canceled) return null

    return resp.filePath
}

export function readFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, contents) => {
            err ? reject(err) : resolve(contents)
        })
    })
}

export function writeFile(filename, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, err => {
            err ? reject(err) : resolve()
        })
    })
}

// ==========================================

export function injectDeps(_class, deps){
    for(let name in deps){
        _class.prototype[name] = deps[name];
    }
}