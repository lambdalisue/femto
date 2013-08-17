(function() {
  var Caret, Coordinate;

  Coordinate = (function() {

    function Coordinate(textarea) {
      this.textarea = textarea;
      this.dummy = document.createElement('div');
      this.style = document.defaultView.getComputedStyle(this.textarea, '');
      this.dummy.style.font = this.style.font;
      this.dummy.style.lineHeight = this.style.lineHeight;
      this.dummy.style.textIndent = this.style.textIndent;
      this.dummy.style.textAlign = this.style.textAlign;
      this.dummy.style.textDecoration = this.style.textDecoration;
      this.dummy.style.textShadow = this.style.textShadow;
      this.dummy.style.letterSpacing = this.style.letterSpacing;
      this.dummy.style.wordSpacing = this.style.wordSpacing;
      this.dummy.style.textTransform = this.style.textTransform;
      this.dummy.style.whiteSpace = this.style.whiteSpace;
      this.dummy.style.width = this.style.width;
      this.dummy.style.height = this.style.height;
      this.dummy.style.visibility = 'hidden';
      this.dummy.style.position = 'absolute';
      this.dummy.style.top = 0;
      this.dummy.style.left = 0;
      this.dummy.style.overflow = 'auto';
      document.body.appendChild(this.dummy);
      this._previousLength = 0;
      this._previousHeight = 0;
    }

    Coordinate.prototype._escapeHTML = function(s) {
      var pre;
      pre = document.createElement('pre');
      pre.textContent = s;
      return pre.innerHTML;
    };

    Coordinate.prototype._coordinate = function(elem) {
      var body, offsetX, offsetY, rect;
      body = document.body;
      offsetX = body.scrollLeft;
      offsetY = body.scrollTop;
      rect = elem.getBoundingClientRect();
      rect = {
        left: (rect.left + offsetX) >> 0,
        right: (rect.right + offsetX) >> 0,
        top: (rect.top + offsetY) >> 0,
        bottom: (rect.bottom + offsetY) >> 0
      };
      return rect;
    };

    Coordinate.prototype.coordinate = function(s, e) {
      var cursor, lhs, offset, processText, uniqid, wholeText,
        _this = this;
      processText = function(text) {
        return _this._escapeHTML(text).replace(/\n/g, '<br>');
      };
      wholeText = this.textarea.value;
      lhs = wholeText.substring(0, e);
      uniqid = Date.now().toString();
      uniqid = "coordinate-cursor-" + uniqid;
      cursor = "<span id='" + uniqid + "'>*</span>";
      if (this._previousLength < lhs.length) {
        offset = this._previousLength;
      } else {
        offset = 0;
        this._previousLength = 0;
        this._previousHeight = 0;
      }
      this.dummy.innerHTML = processText(lhs.substring(offset)) + cursor;
      cursor = document.getElementById(uniqid);
      cursor = this._coordinate(cursor);
      cursor = {
        left: cursor.left + this.styleOffsetX,
        right: cursor.right + this.styleOffsetX,
        top: cursor.top + this._previousHeight,
        bottom: cursor.bottom + this._previousHeight
      };
      this._previousLength = lhs.length;
      this._previousHeight = cursor.top;
      return cursor;
    };

    return Coordinate;

  })();

  Caret = (function() {

    function Caret(textarea, supportCoordinate) {
      this.textarea = textarea;
      if (supportCoordinate === true) {
        this._coordinate = new Coordinate(this.textarea);
      }
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

    Caret.prototype.coordinate = function() {
      if (!(this._coordinate != null)) {
        throw new Error("Caret instance should be construct with " + "second argument `true` to use coordinate method");
      }
      return this._coordinate.coordinate.apply(this._coordinate, this.get());
    };

    return Caret;

  })();

  namespace('Femto.utils', function(exports) {
    return exports.Caret = Caret;
  });

}).call(this);
