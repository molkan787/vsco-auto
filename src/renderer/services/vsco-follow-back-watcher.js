import VscoApp from './vsco-app';
import VscoNotifications from './vsco-notifications';
import { sleep } from '../utils';

export default class VscoFollowBackWatcher{

    constructor(storage, vscoNotifications, vscoApp){
        this.storage = storage;
        this.vscoApp = vscoApp;
        this.vscoNotifications = vscoNotifications;
    }

    start(){
        sleep(90 * 1000).then(() => this.doWork());
    }

    async doWork(){
        try {
            const newFollows = await this.getNewFollowsBack();
            console.log(`VscoFollowBackWatcher: Got ${newFollows.length} new follow back!`)
            for(let user of newFollows){
                try {
                    const message = window.localStorage.getItem('follow_back_message');
                    if(!message) break;

                    await this.vscoApp.sendMessage(user.link, message);

                    this.storage.db.update('followed_users',
                        { message_sent: 1 },
                        { username: user.username }
                    );

                } catch (error) {
                    console.error('VscoFollowBackWatcher.doWork() error');
                    console.error(error);
                }
                await sleep(20 * 1000);
            }
        } catch (error) {
            console.error('VscoFollowBackWatcher.doWork() Error');
            console.error(error);
        }
        // reschdule the work (5 minutes)
        setTimeout(() => this.doWork(), 5 * 60 * 1000);
    }

    async getNewFollowsBack(){
        const result = [];
        const users = await this.getFollowsBack();
        for(let i = 0; i < users.length; i++){
            const user = users[i];
            const db_user = (await this.storage.db.select('followed_users', { username: user.username }))[0];
            if(db_user && db_user.message_sent === 0){
                result.push(user);
            }
        }
        return result;
    }

    async getFollowsBack(){
        const notifications = await this.vscoNotifications.getNotifications();
        const users = [];
        for(let i = 0; i < notifications.length; i++){
            const not = notifications[i];
            if(not.type == 'followed'){
                const user = this.getUserFromNotifcation(not);
                users.push(user);
            }
        }
        return users;
    }

    getUserFromNotifcation(not){
        return {
            link: not.deep_link,
            username: not.headline.split(' ')[0]
        }
    }

}