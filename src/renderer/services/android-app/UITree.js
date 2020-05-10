export default class UITree{

    constructor(node){
        this.node = node;
    }

    findClientRect(attrs){
        const node = this.findNode(attrs);
        return this.getNodeClientRect(node);
    }

    static getNodeClientRect(node){
        const arr = JSON.parse(node.bounds.replace('][', ','));
        const [left, top, right, bottom] = arr;
        const centerX = Math.floor((left + right) / 2);
        const centerY = Math.floor((top + bottom) / 2);
        return {
            left,
            top,
            right,
            bottom,
            centerX,
            centerY
        }
    }

    findNode(attrs, node){
        const _node = node || this.node;
        const matches = _node ? this._compareAttrs(attrs, _node) : false;
        if(matches){
            return _node;
        }else{
            const childs = _node.node;
            if(childs == null){
                return null;
            }else if(childs instanceof Array){
                for(let i = 0; i < childs.length; i++){
                    const foundNode = this.findNode(attrs, childs[i]);
                    if(foundNode){
                        return foundNode;
                    }
                }
            }else{
                return this.findNode(attrs, childs);
            }
        }
        return null;
    }


    _compareAttrs(attrs, node){
        for(let prop in attrs){
            const val = attrs[prop];
            if(node[prop] != val){
                return false;
            }
        }
        return true;
    }

}