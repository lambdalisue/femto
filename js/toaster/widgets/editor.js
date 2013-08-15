(function() {
  var editor;

  editor = function(selector, context, options) {
    /*
      Create an editor widget instance
    
      @param [String or Object] an textarea selector or jQuery instance
      @param [Object] context a context of jQuery
      @param [Object] options an options of femto
      @return [Object] return an extended jQuery instance
    */

    var elem, textarea;
    textarea = Femto.widgets.textarea(selector, context, options);
    textarea.css({
      margin: '0',
      padding: '0',
      border: 'none',
      outline: 'none',
      resize: 'none',
      width: '100%',
      height: '100%'
    });
    elem = Femto.widgets.widget();
    elem.addClass('panel').addClass('editor');
    elem.append(textarea);
    elem.textarea = textarea;
    elem.selection = textarea._selection;
    elem.caretaker = textarea._caretaker;
    elem.shifter = textarea._shifter;
    elem.focus = function() {
      textarea.focus();
      return this;
    };
    elem.blar = function() {
      textarea.blar();
      return this;
    };
    elem.val = function() {
      return textarea.val.apply(textarea, arguments);
    };
    elem.widget = 'editor';
    return elem;
  };

  namespace('Femto.widgets', function(exports) {
    return exports.editor = editor;
  });

}).call(this);
