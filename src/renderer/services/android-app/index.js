import path from 'path';
import { execFile } from 'child_process';
import AdbDevice from './adbDevice';
import FileExtractor from '../storage/file-extractor';
import { sleep } from '../../utils';

export { AdbDevice };

export async function setupDependecies(){
    try {
        const adbClientFilename = path.join(FileExtractor.baseFolder, 'android', 'platform-tools', 'adb.exe');
        const adbFileExist = await FileExtractor.fileExist(adbClientFilename);
        if(!adbFileExist){
            console.log('Extracting Android platform tools...');
            await FileExtractor.extractArchive('platform-tools_r30.0.1-windows.zip', 'android');
            await sleep(1000);
        }
        const output = await asyncExecFile(adbClientFilename, ['start-server']);
        console.log('"adb start-server" output:');
        console.log(output);
    } catch (error) {
        console.error('AndroidApp: setupDependecies() Error');
        console.error(error);
        throw new Error('Failed to setup android client dependecies');
    }
}

function asyncExecFile(filename, args){
    return new Promise((resolve, reject) => {
        execFile(filename, args, (err, stdout) => {
            if(err) reject(err);
            else resolve(stdout.toString());
        })
    })
}