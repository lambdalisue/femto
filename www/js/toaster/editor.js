var Editor;

Editor = function(config, textarea) {
  /*
    Create a Editor jQuery element
  
    Args
      config - dictionary type configure
      textarea - an instance of textarea. used as a base element
  
    Return
      Editor jQuery element
  */

  var caretaker, elem;
  textarea = Widget(config, textarea);
  textarea.css({
    margin: '0',
    padding: '0',
    border: 'none',
    outline: 'none',
    resize: 'none'
  });
  caretaker = new Caretaker();
  textarea.on('keydown', function(e) {
    var _ref;
    if ((_ref = e.which) === 13 || _ref === 9 || _ref === 8 || _ref === 46) {
      return caretaker.save();
    }
  });
  textarea.on('paste,drop', function(e) {
    return caretaker.save();
  });
  if ((Femto.Indent != null) && config.enableTabIndent) {
    textarea._indent = new Femto.Indent(textarea, config.tabString);
    textarea._indent.enable();
  }
  if ((Femto.AutoIndent != null) && config.enableAutoIndent) {
    textarea._autoIndent = new Femto.AutoIndent(textarea, config.tabString);
    textarea._autoIndent.enable();
  }
  elem = Widget(config);
  elem.addClass('panel');
  elem.addClass('editor');
  elem._append(textarea);
  elem._textarea = textarea;
  elem._adjust = function() {
    /* adjust inner element size
    */
    textarea._outerWidth(true, this.width());
    return textarea._outerHeight(true, this.height());
  };
  elem._val = function(value) {
    if (value != null) {
      textarea.val(value);
      return this;
    }
    return textarea.val();
  };
  elem._caretaker = caretaker.originator(elem);
  elem.createMemento = elem._val;
  elem.setMemento = elem._val;
  caretaker.save();
  return elem;
};
