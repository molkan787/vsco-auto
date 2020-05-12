import MessageSender from './message-sender';
import WithEvents from '../../libs/WithEvents';
import { AdbDevice } from '../android-app';

export default class VscoApp extends WithEvents{
    
    constructor(){
        super();
        this.client = new AdbDevice();
        this.messageSender = new MessageSender(this.client);
        this.device = null;
    }

    start(){
        this.loadDevice();
    }

    sendMessage(recipient, message){
        return this.messageSender.send(recipient, message);
    }

    async loadDevice(){
        const devices = await this.client.listDevices().filter(device => device.type == 'device');
        const device = devices[0];
        if(device){
            this.client.use(device);
            this.device = device;
            this.$emit('deviceChanged', device);
        }else{
            this.device = null;
            this.$emit('deviceChanged', null);
        }
        // Update status every 1 minutes
        setTimeout(() => this.loadDevice(), 60 * 1000);
    }

}