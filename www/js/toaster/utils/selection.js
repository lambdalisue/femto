(function() {
  "use strict";

  var W3CSelection, occurrences,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils.Selection = (function() {

    function Selection(textarea) {
      this.textarea = textarea;
      this;

    }

    Selection.prototype._getCaret = function() {
      var e, s;
      s = this.textarea.selectionStart;
      e = this.textarea.selectionEnd;
      return [s, e];
    };

    Selection.prototype._setCaret = function(s, e) {
      this.textarea.setSelectionRange(s, e);
      return this;
    };

    Selection.prototype._getWholeText = function() {
      return this.textarea.value;
    };

    Selection.prototype._setWholeText = function(value) {
      this.textarea.value = value;
      return this;
    };

    Selection.prototype._replace = function(repl, s, e) {
      var a, b, v;
      v = this._getWholeText();
      b = v.substring(0, s);
      a = v.substring(e);
      return this._setWholeText(b + repl + a);
    };

    Selection.prototype.caret = function(s, e) {
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

    Selection.prototype.text = function(text, keepSelection) {
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

    Selection.prototype.lineCaret = function(s, e) {
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

    Selection.prototype.lineText = function(text, keepSelection) {
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

    Selection.prototype.insertBefore = function(text, keepSelection) {
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

    Selection.prototype.insertAfter = function(text, keepSelection) {
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

    Selection.prototype.enclose = function(lhs, rhs, keepSelection) {
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

    Selection.prototype.insertBeforeLine = function(text, keepSelection) {
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

    Selection.prototype.insertAfterLine = function(text, keepSelection) {
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

    Selection.prototype.encloseLine = function(lhs, rhs, keepSelection) {
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

    return Selection;

  })();

  if (document.selection != null) {
    W3CSelection = utils.Selection;
    occurrences = function(str, subStr, allowOverlapping) {
      var n, pos, step;
      str += "";
      subStr += "";
      if (subStr.length <= 0) {
        return str.length + 1;
      }
      n = pos = 0;
      step = allowOverlapping ? 1 : subStr.length;
      while (true) {
        pos = str.indexOf(subStr, pos);
        if (pos >= 0) {
          n++;
          pos += step;
        } else {
          break;
        }
      }
      return n;
    };
    utils.Selection = (function(_super) {

      __extends(Selection, _super);

      function Selection(textarea) {
        this.textarea = textarea;
        this._document = this.textarea.ownerDocument;
      }

      Selection.prototype._getWholeText = function() {
        var value;
        value = this.textarea.value;
        value = value.replace(/\r\n/g, "\n");
        return value;
      };

      Selection.prototype._getCaret = function() {
        var clone, e, range, s;
        range = this._document.selection.createRange();
        clone = range.duplicate();
        clone.moveToElementText(this.textarea);
        clone.setEndPoint('EndToEnd', range);
        s = clone.text.length - range.text.length;
        e = s + range.text.length;
        e -= occurrences(range.text, "\r\n");
        return [s, e];
      };

      Selection.prototype._setCaret = function(s, e) {
        var range;
        range = this.textarea.createTextRange();
        range.collapse(true);
        range.moveStart('character', s);
        range.moveEnd('character', e - s);
        range.select();
        return this;
      };

      return Selection;

    })(W3CSelection);
  }

}).call(this);
