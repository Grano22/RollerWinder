/* ActionsStack Library by Grano22 */
export class ActionError {

}

export class ActionsStack {
    component = null;
    operationsHistoryStack = new Array();
    operationsRestoredStack = new Array();

    errorsStack = window.globalLogsHandler.traceLocalStack();

    namespaceRange = new Array();

    lastAction = "";
    stackSize = 20;

    constructor(component) {
        this.component = component;
    }

    addError(newErr) {
        this.errorsStack.push(newErr);
        console.error(newErr);
    }

    setOperationsNamespace(inArr) {
        if(!Array.isArray(inArr)) { this.addError(new ActionError("Invaild input, array expected", 0, "")); return this; }
        for(let classAction of inArr) this.namespaceRange.push(classAction.prototype.constructor.name); //.prototype.constructor.name
        return this;
    }

    flush() {
        this.lastAction = "flush";
        while(this.operationsHistoryStack.length>0) { let iOper = this.operationsHistoryStack[this.operationsHistoryStack.length - 1]; iOper.onFlush(this.component, iOper.inputData); this.operationsHistoryStack.pop(); }
        this.operationsRestoredStack = new Array();
        this.component.setState({actionHandler:this.toString()});
    }

    flushTyped(filter, withRestored=false) {
        this.lastAction = "flushTyped("+filter+","+withRestored+")";
        this.operationsHistoryStack = this.operationsHistoryStack.map(filter);
        if(withRestored) this.operationsRestoredStack = this.operationsRestoredStack.map(filter);
        this.component.setState({actionHandler:this.toString()});
    }

    addOperation(newOperation, inputData = {}) {
        try {
            this.lastAction = "addOperation";
            if(!this.namespaceRange.includes(newOperation.constructor.name)) throw "Unexpected Action class, use one of registered: "+this.namespaceRange.join(",");
            newOperation.inputData = inputData;
            let outCpt = newOperation.onStore(this.component, inputData, newOperation.outputData) || {};
            this.operationsHistoryStack.push(newOperation);
            if(this.operationsHistoryStack.length>=this.stackSize) this.operationsHistoryStack.shift();
            this.component.setState(Object.assign(outCpt, {actionHandler:this.toString()}));
        } catch(e) {
            console.error(e);
        }
    }

    restoreLastOperation() {
        this.operationsRestoredStack.push(this.operationsHistoryStack[this.operationsHistoryStack.length - 1]);
        this.operationsHistoryStack.pop();
        let iOper = this.operationsRestoredStack[this.operationsRestoredStack.length - 1];
        iOper.onRestore(this.component, iOper.inputData, iOper.outputData);
    }

    restoreOperation() {

    }

    undoRestoring() {
        
    }

    resumeAll() {
        for(let oper in this.operationsHistoryStack) {
            if(this.operationsHistoryStack[oper].type==2) this.operationsHistoryStack[oper].onResume();
        }
    }

    resume(filter, firstOccur=false) {
        for(let oper in this.operationsHistoryStack) {
            let res = filter(this.operationsHistoryStack[oper], oper);
            if(this.operationsHistoryStack[oper].type==2 && res) this.operationsHistoryStack[oper].onResume();
            if(res && firstOccur) break;
        }
    }

    setTypeRange() {

    }

    toString() { return `${this.lastAction}`; }
}

export class ActionOperation {
    name = "";
    description = "";
    type = -1;
    mark = "all";
    creationDate = new Date();
    updateDate = new Date();
    outputData = {};

    constructor(mark="all", name, desc="", type=1) {
        this.mark = mark;
        this.name = name;
        this.description = desc;
        this.type = type;
    }

    onStore() {

    }

    onRestore() {

    }

    onFlush() {

    }

    onUpdate() {

    }


}

export class ActionResumeOperation extends ActionOperation {
    type = 2;
    events = [];

    constructor(mark="all") {
        super(mark);
    }

    onResume() {
        this.restoreEventEntries();
    }

    addEventEntry(elRef, evName, evFn) {
        this.events.push({element:elRef, eventName:evName, event:evFn});   
    }

    restoreEventEntries() {
        this.events.forEach((val, ind, arr)=>{
            if(typeof val.element=="string") {
                let el = document.querySelector(val.element);
                el.addEventListener(val.eventName, val.event);
            } else {
                val.element.addEventListener(val.eventName, val.event);
            }
        })
    }
}

export default { ActionsStack, ActionOperation, ActionResumeOperation };