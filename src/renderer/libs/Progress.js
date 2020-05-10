import WithEvents from './WithEvents';

export default class Progress extends WithEvents{

    constructor(total){
        super();
        this.state = {
            isFinished: false,
            promise: null,
            resolve: null,
            reject: null,
        };
        this.stats = {
            total,
            success: 0,
            failure: 0,
        };
        this.status = {
            code: null,
            title: null,
            text: null,
        }
        this.data = [];
    }

    finish(code, title, text){
        if(this.isFinished) return;
        this.setStatus(code, title, text);
        this.close();
        this._finish(status);
    }

    setStatusText(text){
        const { code, title } = this.status;
        this.setStatus(code, title, text);
    }

    setStatus(code, title, text){
        this.status.code = code;
        this.status.title = title;
        this.status.text = text;
        this.$emit('statusChanged', {
            code,
            title,
            text
        });
    }

    report(success, failure){
        const c = this.stats;
        c.success += success;
        c.failure += failure;
        const current = c.success + c.failure;
        this.$emit('changed', {
            success: c.success,
            failure: c.failure,
            total: c.total,
            current,
            percent: current / c.total
        });
    }

    addData(data){
        this.data.push(data);
        this.$emit('data', data);
    }

    _finish(){
        const s = this.state;
        s.isFinished = true;
        if(s.resolve) s.resolve();
        this.$emit('finished', {
            stats: this.stats,
            status: this.status
        });
    }

    wait(){
        const s = this.state;
        if(s.isFinished){
            return Promise.resolve();
        }
        if(s.promise === null){
            s.promise = new Promise((resolve, reject) => {
                s.resolve = resolve;
                s.reject = reject;
            })
        }
        return s.promise;
    }

    get isFinished(){
        return this.state.isFinished;
    }

}