class AbstractEntry {
    creationDate = new Date();

    constructor(name="", desc="") {
        this.name = name;
        this.description = desc;
    }

    toString() {
        return `Title: ${this.name}\nDescription: ${this.description}\nCreation Datetime: ${this.creationDate.toJSON().slice(0, 19).replace('T', ' ')}`;
    }
}

export class LogEntry extends AbstractEntry {
    constructor(log=null, name="", desc="") {
        super(name, desc);
        this.value = log;
    }

    toString() {
        return `Title: ${this.name}\nDescription: ${this.description}\nCreation Datetime: ${this.creationDate.toJSON().slice(0, 19).replace('T', ' ')}\nLog: ${log.toString()}`;
    }

    toConsoleData() {
        return [`Title: ${this.name}\nDescription: ${this.description}\nCreation Datetime: ${this.creationDate.toJSON().slice(0, 19).replace('T', ' ')}\nLog:\n`, this.value];
    }
}

export class ErrorEntry extends AbstractEntry {
    constructor(name="", type=0, desc="") {
        super(name, desc);
        this.type = type;
    }

    toString() {
        return ` ${this.name} `;
    }
}

export class LogsHandler {
    logs = new Array();
    warns = new Array();
    errors = new Array();
    localStack = [];

    push(smData, type="error") {

    }

    traceLocalStack() {
        let newlocalStack = new LogsHandler();
        this.localStack.push(newlocalStack);
        return newlocalStack;
    }

    constructor(newGlobalHandler=null, stackLimit = 10) {
        if(newGlobalHandler instanceof LogsHandler) this.globalHandler = newGlobalHandler;
        this.stackLimit = stackLimit;
    }
}

export class LogsGlobalHandler extends LogsHandler {
    debugMode = true;

    constructor() {
        super();
        //if(window.onerror==null) this.init();
    }
    
    init() {
        let selfRef = this;
        this.printLog = window.console.log.bind(window.console); //'%c %s','background: green; color: white'
        window.console.log = function() {
            let handlerRef = null, i = 0;
            if(arguments[0] instanceof LogsHandler) { handlerRef = arguments[0]; i = 1; } else handlerRef = selfRef;
            for(;i<arguments.length;i++) {
                let newLogInstance = null;
                if(arguments[i] instanceof LogEntry) {
                    
                } else {
                    newLogInstance = new LogEntry(arguments[i], "Annonymous Log");
                    //newLogInstance = new LogEntry(arguments[i].value, arguments[i].name, arguments[i].description);
                }
                handlerRef.logs.push(newLogInstance);
                selfRef.printLog.apply(window.console, newLogInstance.toConsoleData()); //newLogInstance.toConsoleData()
                Function.prototype.bind.call(selfRef.printLog, window.console, "sss");
            }
        }
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            alert(msg);
        }
    }
}