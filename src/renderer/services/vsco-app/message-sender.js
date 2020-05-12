import VSC from './vsco-consts';
import { sleep } from '../../utils';

export default class MessageSender{

    constructor(client){
        this.client = client;
    }

    async send(recipient, message){
        const client = this.client;

        const isDeepLink = recipient.startsWith('vsco://');

        await client.wakeUp();
        await sleep(2000);

        if(isDeepLink){
            await client.launch(recipient);
            await sleep(5000);  
        }else{
            await client.launchActivity(VSC.ACTIVITY_NAME);
            await sleep(5000);
        
            await client.waitNodeAndTapIt(VSC.FILTER_BOTNAV_DISCOVER);
            await sleep(2000);
        
            await client.waitNodeAndTapIt(VSC.FILTER_HEADER_SEARCH_BTN);
            await sleep(2000);
        
            await client.waitNodeAndTapIt(VSC.FILTER_SEARCH_BOX);
            await sleep(1000);
            await client.writeText(recipient);
            await sleep(1000);
            
            await client.waitNodeAndTapIt(VSC.FILTER_USER_ROW);
            await sleep(1000);  
        }
        
        await client.waitNodeAndTapIt(VSC.FILTER_MESSAGE_BTN);
        await sleep(1000);
    
        await client.waitNodeAndTapIt(VSC.FILTER_MESSAGE_TEXTBOX);
        await client.writeText(message);
        await sleep(2000);
    
        await client.waitNodeAndTapIt(VSC.FILTER_SEND_MESSAGE_BTN);
        await sleep(4000);
        
        for(let i = 0; i < 4; i++){
            await client.back();
            await sleep(1000);
        }
    }

}