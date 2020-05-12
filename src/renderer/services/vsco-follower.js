import Botter from '../libs/Botter';
import VS from './vsco-consts';
import Progress from '../libs/Progress';
import { sleep, rndSleep, textCompare } from '../utils';

window.Botter = Botter;

export default class VscoFollower{

    constructor(vscoSession){
        this.vscoSession = vscoSession;
    }

    followSearchResult(query, interval){
        const progress = new Progress(1);
        (async () => {
            try {
                const bot = new Botter();
                progress.wait().then(() => bot.destroy());
                window.bot = bot;
                await bot.navigate(VS.BASE_URL);
                await this.checkSession(bot);
                await rndSleep(5000, 10000);
                await bot.clickElement(VS.SEL_SEARCH_BTN);
                await rndSleep(2000, 5000);
                await bot.setValue(VS.SEL_SEARCH_INPUT, query);
                await rndSleep(5000, 10000);
                if(progress.isFinished) return;
                await this.followAllUsers(progress, bot, interval);
                progress.finish('completed');
            } catch (error) {
                console.log('Got error')
                console.error(error)
            }
        })();
        return progress;
    }

    async followAllUsers(progress, bot, interval){
        let offset = 0;
        while(true){
            if(progress.isFinished) break;
            const loadedCount = await this.followUsers(progress, bot, interval, offset);
            offset += loadedCount;
            if(loadedCount == 0) break;
            const loadMoreBtn = await bot.elIsVisible(VS.SEL_LOADMORE_BTN, 1);
            if(loadMoreBtn){
                await bot.scrollToElement(VS.SEL_LOADMORE_BTN, 1);
                await sleep(500);
                await bot.clickElement(VS.SEL_LOADMORE_BTN, 1);
            }else{
                await bot.scrollToElement('footer');
            }
            await rndSleep(5000, 8000);
        }
        return offset;
    }

    async followUsers(progress, bot, interval, offset){
        const btns = await bot.querySelectorAll(VS.SEL_FOLLOW_BTN, offset);
        for(let btn of btns){
            if(progress.isFinished) break;
            if(textCompare(btn.innerText, VS.TEXT_FOLLOW_BTN)){
                await btn.click();
                progress.report(1, 0);
                const username = await this.getAssociatedUsername(btn);
                if(username) progress.addData(username);
                await this.randomSleep(interval);
            }
        }
        return btns.length;
    }

    async getAssociatedUsername(btn){
        try {
            const parent = await (await btn.getParentNode()).getParentNode()
            const href = parent.querySelector('a').href;
            const parts = href.split('/');
            const username = parts[parts.length - 1];
            return username;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async checkSession(bot){
        await sleep(2000);
        const signInBtn = await bot.elIsVisible(VS.SEL_SIGN_IN_BTN);
        if(signInBtn){
            await alert('We will now open VSCO.co website, Please sign in to your account.')
            await this.signIn(bot);
        }
    }

    signIn(bot){
        this.vscoSession.bot = bot;
        return this.vscoSession.signIn(); 
    }

    randomSleep(interval){
        const onethird = Math.floor(interval / 3);
        return rndSleep(interval - onethird, interval + onethird);
    }

}