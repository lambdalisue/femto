javascript:(function(){
    var s = document.createElement('script');
    s.src='http://goo.gl/NHDBkx';
    s.onload = function(){
        console.log('Loaded');
        Femto.transformAll();
    };
    document.body.appendChild(s);
})();
