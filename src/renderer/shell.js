import services from './services';
import { sleep } from './utils';
const { vscoSession } = services;

export default class Shell{

    static async doWork(){
        const signedIn = await vscoSession.isSignedIn();
        console.log('signedIn', signedIn);
        if(!signedIn){
            await alert('Before using the software you need to sign in to your VSCO account, We will now open the VSCO.co website.');
            await vscoSession.signIn();
        }
        await sleep(500);
        vscoSession.destroy();
        document.getElementById('loadingPanel').style.display = 'none';
    }

}