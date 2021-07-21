'use strict'
var globalWindow = window;
globalWindow.DOMResizer = function(contextEl, cb) {
    if(typeof ResizeObserver != "undefined") {
        new ResizeObserver(cb).observe(contextEl);
    }
}