(function() {
  var transform, transformAll;

  transform = function(textarea, options) {
    var caretaker, femto, indent, originator;
    if (options == null) {
      options = {};
    }
    options = Femto.utils.extend(options, {
      'caretaker': true,
      'indent': true,
      'expandTab': true,
      'indentLevel': 4
    });
    femto = {};
    femto.options = options;
    originator = new Femto.utils.Originator();
    originator.createMemento = function() {
      return textarea.value;
    };
    originator.setMemento = function(value) {
      return textarea.value = value;
    };
    caretaker = new Femto.utils.Caretaker(originator);
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
        return e.preventDefault();
      }
    };
    indent = new Femto.utils.Indent(textarea, options);
    femto.originator = originator;
    femto.caretaker = caretaker;
    femto.indent = indent;
    femto.caret = indent.caret;
    femto.linecaret = indent.linecaret;
    femto._keyDownEvent = function(e) {
      if (options.caretaker) {
        caretaker._keyDownEvent(e);
      }
      if (options.indent) {
        return indent._keyDownEvent(e);
      }
    };
    femto._caretakerEvent = function(e) {
      if (options.caretaker) {
        return caretaker.save();
      }
    };
    femto.enable = function() {
      textarea.addEventListener('keydown', femto._keyDownEvent, false);
      textarea.addEventListener('paste', femto._caretakerEvent, false);
      return textarea.addEventListener('drop', femto._caretakerEvent, false);
    };
    femto.disable = function() {
      textarea.removeEventListener('keydown', femto._keyDownEvent, false);
      textarea.removeEventListener('paste', femto._caretakerEvent, false);
      return textarea.removeEventListener('drop', femto._caretakerEvent, false);
    };
    femto.enable();
    textarea.femto = femto;
    return textarea;
  };

  transformAll = function(options) {
    var dlist, slist, textarea, _i, _len;
    slist = document.getElementsByTagName('textarea');
    dlist = [];
    for (_i = 0, _len = slist.length; _i < _len; _i++) {
      textarea = slist[_i];
      dlist.push(transform(textarea));
    }
    return dlist;
  };

  namespace('Femto', function(exports) {
    exports.transform = transform;
    return exports.transformAll = transformAll;
  });

}).call(this);
