<template>
    <div>
        <v-card class="pa-4" elevation="1">
            <h4>Follow users</h4>
            <br>
            <v-text-field v-model="query" :loading="working" :disabled="working" label="Search phrase" outlined dense/>
            <v-select v-model="interval" :items="intervals" :disabled="working" label="Interval" dense hide-details outlined/>
            <br>
            <template v-if="working">
                <p>Status: {{ progressText }}</p>
            </template>
            <v-btn block elevation="1" @click="startBtnClick">{{ working ? 'Stop' : 'Start' }}</v-btn>
        </v-card>
    </div>
</template>

<script>
import services from '../services'
const { vscoFollower } = services;
export default{
    data:() => ({
        query: '',
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
        ]
    }),
    computed: {
        progressText(){
            return this.progress == 0 ? 'starting...' : `followed ${this.progress} user`;
        }
    },
    methods: {
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
            this.progressController = vscoFollower.followSearchResult(query, this.interval);
            this.progressController.on('changed', stats => this.progress = stats.success);
            await this.progressController.wait();
            alert(`Process completed, ${this.progressController.stats.success} users got followed!`);
            this.working = false;
        },

        clear(){
            this.progress = 0;
        }
    }
}
</script>