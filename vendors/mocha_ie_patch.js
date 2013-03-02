if (typeof process !== "undefined") {
    process.nextTick = (function(){
    var timeouts = []
    // postMessage behaves badly on IE8
    if (window.ActiveXObject || !window.postMessage) {
        return function(fn){
        timeouts.push(fn);
        setTimeout(function(){
            if (timeouts.length) timeouts.shift()();
        }, 0);
        }
    }

    // based on setZeroTimeout by David Baron
    // - http://dbaron.org/log/20100309-faster-timeouts
    var name = 'mocha-zero-timeout'

    window.addEventListener('message', function(e){
        if (e.source == window && e.data == name) {
        if (e.stopPropagation) e.stopPropagation();
        if (timeouts.length) timeouts.shift()();
        }
    }, true);

    return function(fn){
        timeouts.push(fn);
        window.postMessage(name, '*');
    }
    })();
}
