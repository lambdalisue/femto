var Editor;

Editor = function(textarea) {
  var caretaker, elem;
  textarea = Widget(textarea);
  textarea.css({
    margin: '0',
    padding: '0',
    border: 'none',
    outline: 'none',
    resize: 'none'
  });
  textarea.createMemento = textarea.val;
  textarea.setMemento = textarea.val;
  elem = Widget();
  elem.addClass('panel').addClass('editor');
  elem.append(textarea);
  elem.textarea = textarea;
  elem.adjust = function() {
    textarea.outerWidth(true, this.width());
    return textarea.outerHeight(true, this.height());
  };
  elem.val = function() {
    return textarea.val.apply(textarea, arguments);
  };
  elem.caretaker = caretaker = (new utils.Caretaker(textarea)).save();
  textarea.on('keydown', function(e) {
    var _ref;
    if ((_ref = e.which) === 13 || _ref === 9 || _ref === 8 || _ref === 46) {
      return caretaker.save();
    }
  });
  textarea.on('paste,drop', function(e) {
    return caretaker.save();
  });
  return elem;
};
