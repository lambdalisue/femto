/*
Cross-browser textarea selection module

@author lambdalisue
@since 2013
*/

"use strict";

utils.Selection = utils.W3CSelection = (function() {
  /*
    Closs-browser textarea selection
  */

  function W3CSelection(textarea) {
    this.textarea = textarea;
    /* Selection constructor
    */

  }

  W3CSelection.prototype._getCaret = function() {
    var e, s;
    s = this.textarea.selectionStart;
    e = this.textarea.selectionEnd;
    return [s, e];
  };

  W3CSelection.prototype._setCaret = function(s, e) {
    this.textarea.setSelectionRange(s, e);
    return this;
  };

  W3CSelection.prototype._getWholeText = function() {
    return this.textarea.value;
  };

  W3CSelection.prototype._setWholeText = function(value) {
    this.textarea.value = value;
    return this;
  };

  W3CSelection.prototype._replace = function(repl, s, e) {
    var a, b, v;
    v = this._getWholeText();
    b = v.substring(0, s);
    a = v.substring(e);
    return this._setWholeText(b + repl + a);
  };

  /*
    Get or set caret
  
    @param [s] start index of the caret
  */


  W3CSelection.prototype.caret = function(s, e) {
    var caret, scrollTop;
    if (!(s != null)) {
      return this._getCaret();
    }
    if (!(e != null)) {
      caret = this._getCaret();
      return this.caret(caret[0] + s, caret[1] + s);
    }
    scrollTop = this.textarea.scrollTop;
    this._setCaret(s, e);
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.text = function(text, keepSelection) {
    var e, s, scrollTop, _ref;
    _ref = this._getCaret(), s = _ref[0], e = _ref[1];
    if (!(text != null)) {
      return this._getWholeText().substring(s, e);
    }
    scrollTop = this.textarea.scrollTop;
    this._replace(text, s, e);
    e = s + text.length;
    if (!keepSelection) {
      s = e;
    }
    this._setCaret(s, e);
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.lineCaret = function(s, e) {
    var ee, ss, v, _ref;
    if (!(s != null) || !(e != null)) {
      _ref = this._getCaret(), ss = _ref[0], ee = _ref[1];
      s = s != null ? s : ss;
      e = e != null ? e : ee;
    }
    v = this._getWholeText();
    s = v.lastIndexOf("\n", s - 1) + 1;
    e = v.indexOf("\n", e);
    if (e === -1) {
      e = v.length;
    }
    return [s, e];
  };

  W3CSelection.prototype.lineText = function(text, keepSelection) {
    var e, s, scrollTop, _ref;
    _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
    if (!(text != null)) {
      return this._getWholeText().substring(s, e);
    }
    scrollTop = this.textarea.scrollTop;
    this._replace(text, s, e);
    e = s + text.length;
    if (!keepSelection) {
      s = e;
    }
    this._setCaret(s, e);
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.insertBefore = function(text, keepSelection) {
    var e, s, scrollTop, str, _ref;
    _ref = this._getCaret(), s = _ref[0], e = _ref[1];
    str = this.text();
    scrollTop = this.textarea.scrollTop;
    this._replace(text + str, s, e);
    e = s + text.length;
    if (!keepSelection) {
      s = e;
    }
    this._setCaret(s, e);
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.insertAfter = function(text, keepSelection) {
    var e, s, scrollTop, str, _ref;
    _ref = this._getCaret(), s = _ref[0], e = _ref[1];
    str = this.text();
    scrollTop = this.textarea.scrollTop;
    this._replace(str + text, s, e);
    s = e;
    e = e + text.length;
    if (!keepSelection) {
      s = e;
    }
    this._setCaret(s, e);
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.enclose = function(lhs, rhs, keepSelection) {
    var e, lastIndexOf, s, scrollTop, str, text, _ref;
    text = this.text();
    scrollTop = this.textarea.scrollTop;
    lastIndexOf = text.lastIndexOf(rhs);
    if (text.indexOf(lhs) === 0 && lastIndexOf === (text.length - rhs.length)) {
      str = text.substring(lhs.length, text.length - rhs.length);
      this.text(str, keepSelection);
    } else {
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      this._replace(lhs + text + rhs, s, e);
      e = s + lhs.length + text.length + rhs.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
    }
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.insertBeforeLine = function(text, keepSelection) {
    var e, s, scrollTop, str, _ref;
    _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
    str = this.lineText();
    scrollTop = this.textarea.scrollTop;
    this._replace(text + str, s, e);
    e = s + text.length;
    if (!keepSelection) {
      s = e;
    }
    this._setCaret(s, e);
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.insertAfterLine = function(text, keepSelection) {
    var e, s, scrollTop, str, _ref;
    _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
    str = this.lineText();
    scrollTop = this.textarea.scrollTop;
    this._replace(str + text, s, e);
    s = e;
    e = e + text.length;
    if (!keepSelection) {
      s = e;
    }
    this._setCaret(s, e);
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  W3CSelection.prototype.encloseLine = function(lhs, rhs, keepSelection) {
    var e, lastIndexOf, s, scrollTop, str, text, _ref;
    text = this.lineText();
    scrollTop = this.textarea.scrollTop;
    lastIndexOf = text.lastIndexOf(rhs);
    if (text.indexOf(lhs) === 0 && lastIndexOf === (text.length - rhs.length)) {
      str = text.substring(lhs.length, text.length - rhs.length);
      this.text(str, keepSelection);
    } else {
      _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
      this._replace(lhs + text + rhs, s, e);
      e = s + lhs.length + text.length + rhs.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
    }
    this.textarea.scrollTop = scrollTop;
    return this;
  };

  return W3CSelection;

})();
