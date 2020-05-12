import { sleep, rnd } from '../../utils'
import path from 'path'

const { BrowserWindow } = require('electron').remote.require('electron');
 
export default class Botter{

    static get Appear(){ return 1 }
    static get Disappear(){  return 2 }


    constructor(options){
        const { sessionId } = options || {};
        this.wv = this._createBrowserWindow(sessionId || '__default');
        this.wv.webContents.on('dom-ready', () => this._wvLoaded());

        this.temEl = document.createElement('template');
        this.toExec = []
        this.state = {
            proxyWasSet: false,
            currentProxy: null,
        };
    }

    destroy(){
        this.wv.destroy();
        this.wv = null;
        this.temEl.remove();
        this.temEl = null;
        this.toExec = null;
        this.state = null;
    }

    allwaysExec(sx){
        this.toExec.push(sx)
    }

    attachProxy(proxy){
        this.state.currentProxy = proxy;
        this.state.proxyWasSet = false;
    }

    setProxy(proxy){
        const { host, port, username, password } = proxy;
        return this.wv.webContents.session.setProxy({
            proxyRules: `http://${host}:${port}`,
            // proxyBypassRules: 'https://venus.web.telegram.org/apiw1'
        })
    }

    async setValue(selector, value){
        await this.clickElement(selector)
        await sleep(rnd(50, 200))
        await this.exec(`document.querySelector('${selector}').value = ''`)
        await sleep(50)
        await this.writeText(value)
    }

    async waitForElement(selector, action, timeout){
        let elapsed = 0;
        while(true){
            if(elapsed >= timeout) return false;
            const rect = await this.getElementRect(selector)
            if(action == Botter.Appear && rect) return true;
            if(action == Botter.Disappear && !rect) return true;
            await sleep(100);
            elapsed += 100;
        }
    }

    async writeText(text) {
        // this.wv.webContents.sendInputEvent({ type: 'char', keyCode: ' ' });
        // await sleep(rnd(300, 500));
        this.wv.webContents.replace(text);
    }

    async pressTab(wait){
        this.wv.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Tab' });
        this.wv.webContents.sendInputEvent({ type: 'char', keyCode: ' ' });
        if(wait){
            await sleep(wait);
        }
    }

    async click(x, y) {
        this.wv.webContents.sendInputEvent({ type: 'mouseDown', x, y, button: 'left', clickCount: 1 });
        await sleep(10);
        this.wv.webContents.sendInputEvent({ type: 'mouseUp', x, y, button: 'left', clickCount: 1 });
        await sleep(10);
    }

    async clickElement(selector, index){
        const rect = await this.getElementRect(selector, index)
        if(!rect) throw new Error('Element does not exist.')
        const x = rect.x + rnd(5, 10)
        const y = rect.y + rnd(5, 10)
        await this.click(x, y)
    }

    async elIsVisible(selector, index){
        return (await this.getElementRect(selector, index)) != null
    }

    countElements(selector){
        return this.exec(`document.querySelectorAll('${selector}').length`)
    }

    async querySelectorAll(selector, offset){
        const result = [];
        const els = await this.exec(`__botter.querySelectorAll('${selector}', ${offset})`);
        for(let el of els){
            const _el = this.buildElement(el);
            result.push(_el);
        }
        return result;
    }

    buildElement(data){
        const el = this._parseHTMLElement(data.html);
        el.click = () => this.callElementMethod(data.ref, 'click');
        el.getParentNode = async () => this.buildElement(await this.callElementMethod(data.ref, 'parentNode'));
        return el;
    }

    async scrollToElement(selector, index){
        const rect = await this.getElementRect(selector, index);
        if(rect){
            await this.exec(`document.querySelectorAll('${selector}')[${index || 0}].scrollIntoView()`);
        }else{
            throw new Error('Element not found or not visible');
        }
    }

    getElementRect(selector, index){
        return this.exec(`
        function __getElRect(selector, index){
            const el = index ? document.querySelectorAll(selector)[index] : document.querySelector(selector)
            if(!el) return null;
            const rect = el.getClientRects()[0];
            if(!rect) return null;
            return JSON.parse(JSON.stringify(rect));
        }
        __getElRect('${selector}', ${index});
        `)
    }

    callElementMethod(ref, method){
        return this.exec(`__botter.callElementMethod(${ref}, '${method}')`);
    }

    exec(jscode){
        return this.wv.webContents.executeJavaScript(jscode)
    }

    navigate(url){
        return new Promise(async (resovle, reject) => {
            if(this.state.currentProxy && !this.state.proxyWasSet){
                await this.setProxy(this.state.currentProxy);
                this.state.proxyWasSet = true;
            }
            this.wv.webContentsLoadedHandler = resovle;
            this.wv.webContents.loadURL(url);
        });
    }

    _wvLoaded(){
        if (this.wv.webContentsLoadedHandler) {
            this.wv.webContentsLoadedHandler();
            this.wv.webContentsLoadedHandler = null;
            for(let sx of this.toExec){
                this.exec(sx)
            }
        }
    }

    _parseHTMLElement(rawHTML){
        this.temEl.innerHTML = rawHTML;
        return this.temEl.content.children[0];
    }

    _createBrowserWindow(sessionId){
        return new BrowserWindow({
            show: false,
            width: 1080,
            height: 600,
            webPreferences: {
                preload: path.join(__static, 'delegate.js'),
                partition: `persist:${sessionId}`
            }
        })
    }

}
