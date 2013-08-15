(function() {
  var textarea;

  textarea = function(selector, context, options) {
    /*
      Create an textarea widget instance
    
      @param [String | Object] selector a textarea selector or jQuery instance
      @param [Object] context a context of jQuery
      @param [Object] options an options of femto
      @return [Object] extended jQuery instance
    */

    var caretaker, elem, selection, shifter;
    elem = Femto.widgets.widget(selector, context);
    elem.createMemento = elem.val;
    elem.setMemento = elem.val;
    caretaker = new Femto.utils.Caretaker(elem);
    caretaker.save();
    caretaker._keyDownEvent = function(e) {
      var _ref;
      if ((_ref = e.which) === 13 || _ref === 9 || _ref === 8 || _ref === 46) {
        caretaker.save();
      }
      if (e.which === 90 && e.ctrlKey) {
        if (e.shiftKey) {
          caretaker.redo();
        } else {
          caretaker.undo();
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
      }
      return true;
    };
    selection = new Femto.utils.Selection(elem.get(0));
    shifter = new Femto.utils.Shifter(elem, selection, options.expandTab, options.indentLevel);
    elem.on('keydown', function(e) {
      var result;
      result = true;
      result = result && shifter._keyDownEvent(e);
      result = result && caretaker._keyDownEvent(e);
      return result;
    });
    elem.on('paste,drop', function(e) {
      return caretaker.save();
    });
    elem._caretaker = caretaker;
    elem._selection = selection;
    elem._shifter = shifter;
    elem.save = function() {
      var _ref;
      return (_ref = this._caretaker).save.apply(_ref, arguments);
    };
    elem.undo = function() {
      var _ref;
      return (_ref = this._caretaker).undo.apply(_ref, arguments);
    };
    elem.redo = function() {
      var _ref;
      return (_ref = this._caretaker).redo.apply(_ref, arguments);
    };
    elem.indent = function() {
      var _ref;
      return (_ref = this._shifter).indent.apply(_ref, arguments);
    };
    elem.outdent = function() {
      var _ref;
      return (_ref = this._shifter).outdent.apply(_ref, arguments);
    };
    elem.insertNewLine = function() {
      var _ref;
      return (_ref = this._shifter).insertNewLine.apply(_ref, arguments);
    };
    elem.widget = 'textarea';
    return elem;
  };

  namespace('Femto.widgets', function(exports) {
    return exports.textarea = textarea;
  });

}).call(this);
