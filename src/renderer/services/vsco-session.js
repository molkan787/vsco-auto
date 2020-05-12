import Botter from '../libs/Botter';
import VS from './vsco-consts';
import { rndSleep, sleep } from '../utils';

export default class VscoSession{

    constructor(){
        this.bot = null;
        this.authToken = '';
        this.userId = '';
    }

    prepare(){
        if(this.bot == null){
            this.bot = new Botter();
        }
    }

    destroy(){
        if(this.bot !== null){
            this.bot.destroy();
            this.bot = null;
        }
    }

    async isSignedIn(){
        this.prepare();
        await this.bot.navigate(VS.BASE_URL);
        await sleep(2000);
        const signInBtn = await this.bot.elIsVisible(VS.SEL_SIGN_IN_BTN);
        const signedIn = !signInBtn;
        if(signedIn){
            await this.loadUser();
        }
        return signedIn;
    }

    async signIn(){
        this.prepare();
        await this.bot.navigate(VS.LOGIN_PAGE_URL);
        await sleep(1000);
        this.bot.wv.show();
        await this.bot.waitForElement(VS.SEL_UPLOAD_BTN, Botter.Appear);
        await sleep(1000);
        await this.loadUser();
        this.bot.wv.hide();
        return true;
    }

    async loadUser(){
        const state = await this.getState();
        if(!state) throw new Error('Could not get page State.');
        this.authToken = state.users.currentUser.tkn;
        this.userId = state.users.currentUser.userId;
    }

    async getState(){
        const scripts = await this.bot.querySelectorAll('script');
        for(let script of scripts){
            if(script.innerText.includes('__PRELOADED_STATE__')){
                const state = JSON.parse(script.innerText.replace('window.__PRELOADED_STATE__ =', ''));
                return state;
            }
        }
        return null;
    }

}