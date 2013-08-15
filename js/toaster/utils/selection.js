
/*
Cross-browser textarea selection class

@example
  textarea = document.createElement('textarea')
  textarea.selection = new Selection(textarea)
  # get current caret position
  [start, end] = textarea.selection.caret()
  # move caret to [1, 5]
  textarea.selection.caret(1, 5)
  # move caret +4
  textarea.selection.caret(4)
  # get selected text
  selected = textarea.selection.text()
  # replace selected text
  textarea.selection.text("HELLO")
*/


(function() {
  var W3CSelection;

  W3CSelection = (function() {
    /*
      Constructor
    
      @param [DOM element] textarea A target textarea DOM element
      @return [Selection] the new instance
    */

    function W3CSelection(textarea) {
      this.textarea = textarea;
      this;

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
      Get caret when called without any argument.
      Set caret when called with two arguments.
      Move caret when called with an argument.
    
      @param [Integer] s a start index of the caret or caret offset
      @param [Integer] e a end index of the caret
      @return [Array, Selection] return [s, e] array when called without any
        arguments. return the instance when called with arguments.
      @note caret will be reset when you change the value of textarea, so
        you have to set caret after you change the value if it's needed
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

    /*
      Return whether the selection's start and end points are the same position
    
      @return [Boolean] true when the selection is collapsed
    */


    W3CSelection.prototype.isCollapsed = function() {
      var e, s, _ref;
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      return s === e;
    };

    /*
      Moves the start point of a range to its end point or vica versa
    
      @param [Boolean] toEnd true to move the end point to the start point
      @return [Selection] instance
    */


    W3CSelection.prototype.collapse = function(toStart) {
      var e, s, _ref;
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      if (toStart) {
        this._setCaret(s, s);
      } else {
        this._setCaret(e, e);
      }
      return this;
    };

    /*
      Get selected text when called without any argument.
      Replace selected text when called with arguments.
    
      @param [String] text a text used to replace the selection
      @param [Boolean] keepSelection select replaced text if it is `true`
      @return [String, Selection] return selected text when called without any
        argument. return the instance when called with arguments
    */


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

    /*
      Get caret of the line on the current caret when called without any argument.
      Get caret of the line on the specified caret when called with two arguments.
    
      @param [Integer] s a start index of the caret
      @param [Integer] e an end index of the caret
      @return [Array] return [s, e] array
    */


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

    /*
      Get line text of the line caret when called without any argument.
      Replace line text of the line caret when called with arguments.
    
      @param [String] text a text used to replace the selection
      @param [Boolean] keepSelection select replaced text if it is `true`
      @return [String, Selection] return selected text when called without any
        argument. return the instance when called with arguments
    */


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

    /*
      Insert text before the selection
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


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

    /*
      Insert text after the selection
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


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

    /*
      Enclose selected text or Open the enclosed text
    
      @param [String] lhs a text used to insert before the selection
      @param [String] rhs a text used to insert after the selection
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


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

    /*
      Insert text before the line
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


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

    /*
      Insert text after the line
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


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

    /*
      Enclose the line or Open the enclosed line
    
      @param [String] lhs a text used to insert before the selection
      @param [String] rhs a text used to insert after the selection
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


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

  namespace('Femto.utils', function(exports) {
    exports.W3CSelection = W3CSelection;
    return exports.Selection = W3CSelection;
  });

}).call(this);
