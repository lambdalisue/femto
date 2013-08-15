mocha.setup({
    ui: 'bdd',
    ignoreLeaks: true
});
$(function() {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        mocha.run()
    }
});
