const adb = require('adbkit');
const xmlParser = require('fast-xml-parser');
import UITree from './UITree';
import { streamToString, sleep } from './utils';

export default class AdbDevice{

    constructor(){
        this.client = adb.createClient();
        this.deviceId = null;
    }

    use(device){
        this.deviceId = device.id;
    }

    listDevices(){
        return this.client.listDevices();
    }

    launchActivity(name){
        return this.client.startActivity(this.deviceId, {
            component: name
        })
    }

    async waitNodeAndTapIt(filters){
        const node = await this.waitNodeAndGetIt(filters);
        const rect = UITree.getNodeClientRect(node);
        await this.tap(rect.centerX, rect.centerY);
    }

    async waitNodeAndGetIt(filters, checkInterval, maxTry){
        const max = maxTry || 20;
        for(let i = 0; i < max; i++){
            try {
                const tree = await this.getUITree();
                const node = tree.findNode(filters);
                if(node){
                    return node;
                }
            } catch (error) {
                console.error(error);
            }
            if(i < max - 1){
                await sleep(checkInterval || 5000);
            }else{
                throw 'NODE_NOT_FOUND_MAX_TRY_REACHED';
            }
        }
    }

    async getUITree(){
        await this.shell('uiautomator dump --compressed $EXTERNAL_STORAGE/window_dump.xml');
        const outStream = await this.shell('cat $EXTERNAL_STORAGE/window_dump.xml');
        const rawString = await streamToString(outStream);
        // console.log(rawString);
        // return;
        const data = xmlParser.parse(rawString, {
            ignoreAttributes: false,
            attributeNamePrefix: ''
        });
        return new UITree(data.hierarchy);
    }

    async dumpUITree(){
        await this.shell('uiautomator dump --compressed $EXTERNAL_STORAGE/window_dump.xml');
        const outStream = await this.shell('cat $EXTERNAL_STORAGE/window_dump.xml');
        const rawString = await streamToString(outStream);
        console.log(rawString);
    }
    
    async getScreenResolution(){
        const outStream = await this.shell('getprop service.secureui.screeninfo');
        const rawString = await streamToString(outStream);
        const [ width, height ] = rawString.replace(/\s/g, '').split('x');
        return {
            width: parseInt(width),
            height: parseInt(height)
        }
    }

    wakeUp(){
        this.shell('input keyevent KEYCODE_WAKEUP');
    }

    back(){
        return this.shell('input keyevent 4');
    }
    
    writeText(text){
        return this.shell(`input text "${text}"`);
    }
    
    tap(x, y){
        return this.shell(`input tap ${x} ${y}`);
    }

    shell(cmd){
        return this.client.shell(this.deviceId, cmd);
    }

}