import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';

export default class FileExtractor {

    static init(){
        
    }

    static async extractArchive(name, destDir){
        const baseDir = this.getBaseFolderPath();
        const _destDir = path.join(baseDir, destDir);
        await this.prepareFolder(_destDir);
        await this.extractZip(name, _destDir);
        return _destDir;
    }

    static async extractIfNotExist(files){
        const baseDir = this.getBaseFolderPath();
        await this.prepareFolder(baseDir);
        for(let file of files){
            const filename = path.join(baseDir, file);
            const exist = await this.fileExist(filename);
            if(!exist){
                await this.extract(file, filename);
            }
        }
    }

    static prepareFolder(path) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, function(err) {
                if (err) {
                    if (err.code == 'EEXIST') resolve(); // ignore the error if the folder already exists
                    else reject(err); // something else went wrong
                } else resolve(); // successfully created folder
            });
        })
    }

    static getPath(name){
        return app.getPath(name) + '\\';
    }

    static setBaseFolderPath(path){
        this.baseFolder = path;
    }

    static getBaseFolderPath(){
        return this.baseFolder;
    }

    static fileExist(path){
        return new Promise((resolve, reject) => {
            try {
              fs.stat(path, (error, file) => {
                if (!error && file.isFile()) {
                  return resolve(true);
                }
        
                if (error && error.code === 'ENOENT') {
                  return resolve(false);
                }
              });
            } catch (err) {
              reject(err);
            }
          });
    }

    static extract(sourceInAsarArchive, destOutsideAsarArchive) {
        return new Promise((resolve, reject) => {
            fs.copyFile(path.join(__static, sourceInAsarArchive), destOutsideAsarArchive, (err) => {
                if (err) {
                    reject(err);
                }else{
                    resolve();
                }
            });
        })
    }

    static extractZip(sourceInAsarArchive, destDir){
        const readStream = fs.createReadStream(path.join(__static, sourceInAsarArchive));
        const writeStream = unzipper.Extract({
            path: destDir
        });
        return readStream.pipe(writeStream).promise();
    }

}