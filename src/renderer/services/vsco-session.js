import Botter from '../libs/Botter';
import VS from './vsco-consts';
import { rndSleep, sleep } from '../utils';

export default class VscoSession{

    constructor(){
        this.bot = null;
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
        return !signInBtn;
    }

    async signIn(){
        this.prepare();
        await this.bot.navigate(VS.LOGIN_PAGE_URL);
        await sleep(1000);
        this.bot.wv.show();
        await this.bot.waitForElement(VS.SEL_UPLOAD_BTN, Botter.Appear);
        await sleep(1000);
        this.bot.wv.hide();
        return true;
    }

}