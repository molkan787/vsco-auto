import VscoFollower from './vsco-follower';
import VscoSession from './vsco-session';
import VscoApp from './vsco-app';

const vscoSession = new VscoSession();
const vscoFollower = new VscoFollower(vscoSession);
const vscoApp = new VscoApp();

window.vscoFollower = vscoFollower;
window.vscoSession = vscoSession;
window.vscoApp = vscoApp;

export default {
    vscoSession,
    vscoFollower,
    vscoApp
};
