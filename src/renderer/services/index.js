import { Storage } from './storage';
import VscoFollower from './vsco-follower';
import VscoNotifications from './vsco-notifications';
import VscoFollowBackWatcher from './vsco-follow-back-watcher';
import VscoSession from './vsco-session';
import VscoApp from './vsco-app';
import setup from './setup';

const storage = new Storage();
const vscoSession = new VscoSession();
const vscoFollower = new VscoFollower(vscoSession);
const vscoNotifications = new VscoNotifications(vscoSession);
const vscoApp = new VscoApp();
const vscoFollowBackWatcher = new VscoFollowBackWatcher(storage, vscoNotifications, vscoApp);

window.vscoFollower = vscoFollower;
window.vscoNotifications = vscoNotifications;
window.vscoFollowBackWatcher = vscoFollowBackWatcher;
window.vscoSession = vscoSession;
window.vscoApp = vscoApp;
window.storage = storage;


async function start(){
    await storage.setup();
    console.log('Storage setup done!');

    await setup();
    console.log('Modules Setup done!');

    vscoApp.start();
    vscoFollowBackWatcher.start();
}

export {
    start,
    vscoSession,
    vscoFollower,
    vscoNotifications,
    vscoFollowBackWatcher,
    vscoApp,
    storage
};
