<template>
    <div>
        <v-card class="pa-4" elevation="1">
            <h4>Follow users</h4>
            <br>
            <v-text-field class="mb-2" v-model="query" :loading="working" :disabled="working" label="Search phrase" placeholder="Search phrase" outlined dense hide-details=""/>
            <v-select class="mb-2" v-model="interval" :items="intervals" :disabled="working" label="Interval" dense hide-details outlined/>
            <template v-if="working">
                <p>Status: {{ progressText }}</p>
            </template>
            <v-btn block elevation="1" @click="startBtnClick">{{ working ? 'Stop' : 'Start' }}</v-btn>
        </v-card>
        <br>
        <v-card class="pa-4" elevation="1">
            <h4>
                Follow back Message
                <v-chip small class="device-status"
                    :color="deviceConnected ? 'green' : 'default'"
                    :text-color="deviceConnected ? 'white' : 'default'">
                    {{ deviceConnected ? 'Phone connected' : 'Phone not connected' }}
                </v-chip>
            </h4>
            <br>
            <v-textarea v-model="message" label="Message" placeholder="Message to be sent..." outlined hide-details no-resize/>
            <v-btn class="mt-2" block elevation="1" @click="saveMessage"
                :disabled="originalMessage == message">
                Save
            </v-btn>
        </v-card>
    </div>
</template>

<script>
import actions from '../actions';
import { vscoApp } from '../services';

export default{
    data:() => ({
        query: '',
        originalMessage: '',
        message: '',
        interval: 5000,
        working: false,
        progress: 0,
        progressController: null,
        intervals: [
            {value: 1000, text: '1 Seconds'},
            {value: 2000, text: '2 Seconds'},
            {value: 3000, text: '3 Seconds'},
            {value: 4000, text: '4 Seconds'},
            {value: 5000, text: '5 Seconds'},
            {value: 10000, text: '10 Seconds'},
            {value: 15000, text: '15 Seconds'},
            {value: 20000, text: '20 Seconds'},
            {value: 30000, text: '30 Seconds'},
            {value: 60000, text: '1 minute'},
        ],
        deviceConnected: false
    }),
    computed: {
        progressText(){
            return this.progress == 0 ? 'starting...' : `followed ${this.progress} user`;
        }
    },
    methods: {
        saveMessage(){
            window.localStorage.setItem('follow_back_message', this.message);
            this.originalMessage = this.message;
        },
        async startBtnClick(){
            if(this.working){
                if(await confirm('Are you sure you want to stop the current process?')){
                    this.progressController.finish('stoped');
                }
            }else{
                this.start();
            }
        },

        async start(){
            const query = this.query.trim();
            if(query.length < 1){
                alert('Please enter search phrase!');
                return;
            }
            this.clear();
            this.working = true;
            this.progressController = actions.searchUsersAndFollow(query, this.interval);
            this.progressController.on('changed', stats => this.progress = stats.success);
            await this.progressController.wait();
            alert(`Process completed, ${this.progressController.stats.success} users got followed!`);
            this.working = false;
        },

        clear(){
            this.progress = 0;
        }
    },

    mounted(){
        this.originalMessage = this.message = window.localStorage.getItem('follow_back_message');
    },

    created(){
        vscoApp.on('deviceChanged', device => this.deviceConnected = !!device);
    }
}
</script>

<style scoped>
.device-status{
    float: right;
}
</style>