export function calculateDOMContextSize(contextEl) {
    var contextWidth = 0, contextHeight = 0;
    if(typeof contextEl.getBoundingClientRect != "undefined") {
        var rect = contextEl.getBoundingClientRect();
        contextWidth = rect.width;
        contextHeight = rect.height;
    } else {
        contextWidth = contextEl.offsetWidth;
        contextHeight = contextEl.offsetHeight;
    }
    return [contextWidth, contextHeight];
}

export default class DOMResizer {
    lastWidth = 0;
    lastheight = 0;


    constructor() {

    }

    onWindowResize(contextEl, cb) {
        var globalWindow = window;
        if(typeof HTMLElement.prototype.addEventListener!="undefined") {
            let preSizing = calculateDOMContextSize(contextEl);
            this.lastWidth = preSizing[0]; this.lastheight = preSizing[1];
            var resizeEvent = function() {
                if(typeof contextEl!="undefined" && contextEl!=null) {
                    var sizing = calculateDOMContextSize(contextEl); 
                    if(this.lastWidth!=sizing[0] && this.lastheight!=sizing[1]) cb(sizing[0], sizing[1]);
                } else globalWindow.removeEventListener("resize", resizeEvent, false)
            }
            globalWindow.addEventListener("resize", resizeEvent, false);
        }
    }
    
    onResize(contextEl, cb) {
        var globalWindow = window;
        if(typeof ResizeObserver != "undefined") {
            new ResizeObserver(()=>{ var sizing = calculateDOMContextSize(contextEl); cb(sizing[0], sizing[1]); }).observe(contextEl);
        } else {
            var requestFrame = globalWindow.requestAnimationFrame ||
            globalWindow.mozRequestAnimationFrame ||
            globalWindow.webkitRequestAnimationFrame || function (fn) {return globalWindow.setTimeout(fn, 20);};
            var cancelFrame = globalWindow.cancelAnimationFrame || globalWindow.mozCancelAnimationFrame || globalWindow.webkitCancelAnimationFrame || function (timer) {globalWindow.clearTimeout(timer);};
            let preSizing = calculateDOMContextSize(contextEl);
            this.lastWidth = preSizing[0]; this.lastheight = preSizing[1];
            var updateEvt = function() {
                if(typeof contextEl!="undefined" && contextEl!=null) {
                    var sizing = calculateDOMContextSize(contextEl);
                    if(this.lastWidth!=sizing[0] && this.lastheight!=sizing[1]) cb(sizing[0], sizing[1]);
                } else cancelFrame(updateEvt);
            }
            requestFrame(updateEvt);
        }
    }
}