(function() {
  var Caret;

  Caret = (function() {

    function Caret(textarea) {
      this.textarea = textarea;
      this;

    }

    Caret.prototype._replace = function(text, repl, s, e) {
      var lhs, rhs;
      lhs = text.substring(0, s);
      rhs = text.substring(e);
      return lhs + repl + rhs;
    };

    Caret.prototype.get = function() {
      var e, s;
      s = this.textarea.selectionStart;
      e = this.textarea.selectionEnd;
      return [s, e];
    };

    Caret.prototype.set = function(s, e) {
      var offset, _ref;
      if (!(e != null)) {
        offset = s;
        _ref = this.get(), s = _ref[0], e = _ref[1];
        s += offset;
        e += offset;
      }
      this.textarea.setSelectionRange(s, e);
      return this;
    };

    Caret.prototype.isCollapsed = function() {
      var e, s, _ref;
      _ref = this.get(), s = _ref[0], e = _ref[1];
      return s === e;
    };

    Caret.prototype.collapse = function(toStart) {
      var e, s, _ref;
      _ref = this.get(), s = _ref[0], e = _ref[1];
      if (toStart === true) {
        return this.set(s, s);
      } else {
        return this.set(e, e);
      }
    };

    Caret.prototype.text = function(text, keepSelection) {
      var e, s, scrollTop, wholeText, _ref;
      _ref = this.get(), s = _ref[0], e = _ref[1];
      wholeText = this.textarea.value;
      if (!(text != null)) {
        return wholeText.substring(s, e);
      } else {
        scrollTop = this.textarea.scrollTop;
        wholeText = this._replace(wholeText, text, s, e);
        this.textarea.value = wholeText;
        e = s + text.length;
        if (!keepSelection) {
          s = e;
        }
        this.set(s, e);
        this.textarea.scrollTop = scrollTop;
      }
      return this;
    };

    Caret.prototype.insertBefore = function(text, keepSelection) {
      var e, s, scrollTop, selection, wholeText, _ref;
      _ref = this.get(), s = _ref[0], e = _ref[1];
      scrollTop = this.textarea.scrollTop;
      wholeText = this.textarea.value;
      selection = wholeText.substring(s, e);
      wholeText = this._replace(wholeText, text + selection, s, e);
      this.textarea.value = wholeText;
      e = s + text.length;
      if (!keepSelection) {
        s = e;
      }
      this.set(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    Caret.prototype.insertAfter = function(text, keepSelection) {
      var e, s, scrollTop, selection, wholeText, _ref;
      _ref = this.get(), s = _ref[0], e = _ref[1];
      scrollTop = this.textarea.scrollTop;
      wholeText = this.textarea.value;
      selection = wholeText.substring(s, e);
      wholeText = this._replace(wholeText, selection + text, s, e);
      this.textarea.value = wholeText;
      s = e;
      e = e + text.length;
      if (!keepSelection) {
        s = e;
      }
      this.set(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    Caret.prototype.enclose = function(lhs, rhs, keepSelection) {
      var e, endsWith, s, scrollTop, selection, startsWith, wholeText, _ref;
      startsWith = function(str, prefix) {
        return str.lastIndexOf(prefix, 0) === 0;
      };
      endsWith = function(str, suffix) {
        var sub;
        sub = str.length - suffix.length;
        return sub >= 0 && str.indexOf(suffix, sub) !== -1;
      };
      scrollTop = this.textarea.scrollTop;
      wholeText = this.textarea.value;
      selection = this.text();
      if (startsWith(selection, lhs) && endsWith(selection, rhs)) {
        selection = selection.substring(lhs.length, selection.length - rhs.length);
        this.text(selection, keepSelection);
      } else {
        _ref = this.get(), s = _ref[0], e = _ref[1];
        selection = lhs + selection + rhs;
        wholeText = this._replace(wholeText, selection, s, e);
        this.textarea.value = wholeText;
        e = s + selection.length;
        if (!keepSelection) {
          s = e;
        }
        this.set(s, e);
      }
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    return Caret;

  })();

  namespace('Femto.utils', function(exports) {
    return exports.Caret = Caret;
  });

}).call(this);
