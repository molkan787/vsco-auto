import electron from 'electron';
import path from 'path';
import FileExtractor from './file-extractor';
import Database from '../../libs/Database';

window.FileExtractor = FileExtractor;

export default class Storage{

    constructor(){
        this.db = new Database();
        const documentsDir = electron.remote.app.getPath('documents');
        const appDataDir = path.join(documentsDir, 'VSCO-Auto');
        FileExtractor.setBaseFolderPath(appDataDir);
        FileExtractor.init();
        this.appDataDir = appDataDir;
        this.databaseFilename = path.join(appDataDir, 'data.db');
    }

    async setup(){
        await FileExtractor.extractIfNotExist([
            'data.db',
        ])
        await this.db.open(this.databaseFilename);
    }

}