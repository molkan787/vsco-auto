function __botter_init(){

    const state = {
        refPtr: 0,
        els: []
    }

    const genRef = () => state.refPtr++

    this.querySelectorAll = function(selector, offset){
        const result = [];
        const start = offset || 0;
        const els = document.querySelectorAll(selector);
        for(let i = start; i < els.length; i++){
            const el = els[i];
            result.push(this.prepareElement(el));
        }
        return result;
    }

    this.callElementMethod = function (ref, method){
        const el = state.els[ref];
        if(method === 'parentNode'){
            return this.prepareElement(el.parentNode);
        }else{
            el[method]();
        }
    }

    this.prepareElement = function (el){
        const html = el.outerHTML;
        const ref = genRef();
        state.els[ref] = el;
        return {
            html,
            ref
        };
    }

}

window.__botter = new __botter_init();