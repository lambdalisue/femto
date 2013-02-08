var utils = {};

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

  describe('femto.utils.Selection', function() {
    var Selection, expected_methods, expected_private_methods, instance, method, textarea, value, _fn, _fn1, _i, _j, _len, _len1;
    textarea = instance = value = null;
    Selection = utils.Selection;
    before(function() {
      textarea = document.createElement('textarea');
      textarea.rollback = function() {
        return this.value = 'AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333';
      };
      textarea.rollback();
      value = function() {
        return textarea.value.replace(/\r\n/g, "\n");
      };
      instance = new Selection(textarea);
      document.body.appendChild(textarea);
      return textarea.focus();
    });
    afterEach(function() {
      return textarea.rollback();
    });
    expected_private_methods = ['_getCaret', '_setCaret', '_replace'];
    _fn = function(method) {
      return it("instance should have private `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_i = 0, _len = expected_private_methods.length; _i < _len; _i++) {
      method = expected_private_methods[_i];
      _fn(method);
    }
    expected_methods = ['caret', 'text', 'lineCaret', 'lineText', 'insertBefore', 'insertAfter', 'enclose', 'insertBeforeLine', 'insertAfterLine', 'encloseLine'];
    _fn1 = function(method) {
      return it("instance should have public `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_j = 0, _len1 = expected_methods.length; _j < _len1; _j++) {
      method = expected_methods[_j];
      _fn1(method);
    }
    describe('#caret(s, e) -> [s, e] | instance', function() {
      it('should return current caret position as a list when called without any arguments', function() {
        var caret;
        instance.caret(0, 0);
        caret = instance.caret();
        expect(caret).to.be.a('array');
        return expect(caret).to.be.eql([0, 0]);
      });
      it('should return the instance when called with arguments', function() {
        var result;
        result = instance.caret(0, 0);
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        result = instance.caret(0);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it('should change caret position to specified when called with two arguments', function() {
        var caret;
        caret = instance.caret(1, 2).caret();
        return expect(caret).to.be.eql([1, 2]);
      });
      return it('should change caret position with specified offset when called with one argument', function() {
        var ncaret, pcaret;
        pcaret = instance.caret(0, 0).caret();
        ncaret = instance.caret(5).caret();
        return expect(ncaret).to.be.eql([pcaret[0] + 5, pcaret[1] + 5]);
      });
    });
    describe('#text(text, keepSelection) -> string | instance', function() {
      it('should return current selected text when called without any arguments', function() {
        var text;
        instance.caret(0, 0);
        text = instance.text();
        expect(text).to.be.a('string');
        expect(text).to.be.eql('');
        instance.caret(5, 25 + 1);
        text = instance.text();
        return expect(text).to.be.eql("BBBBBCCCCC\naaaaabbbbb");
      });
      it('should return the instance when called with arguments', function() {
        var result;
        instance.caret(0, 0);
        result = instance.text('HELLO');
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.text('HELLO', true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it('should insert text before the caret when no text is selected and called with one argument', function() {
        var result;
        instance.caret(0, 0);
        result = instance.text("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text before the caret and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.text("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should replace text of selected when text is selected and called with one argument", function() {
        var result;
        instance.caret(3, 12);
        result = instance.text("HELLO");
        return expect(value()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should replace text of selected and select replacement when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(3, 12);
        result = instance.text("HELLO", true);
        expect(value()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([3, 8]);
      });
    });
    describe("#lineCaret(s, e) -> [s, e]", function() {
      it("should return current line caret position as a list when called without any arguments", function() {
        var lcaret;
        instance.caret(5, 25 + 1);
        lcaret = instance.lineCaret();
        expect(lcaret).to.be.a("array");
        return expect(lcaret).to.be.eql([0, 30 + 1]);
      });
      return it("should return specified line caret position as a list when called with arguments", function() {
        var lcaret;
        instance.caret(0, 0);
        lcaret = instance.lineCaret(5, 25 + 1);
        expect(lcaret).to.be.a("array");
        expect(lcaret).to.be.eql([0, 30 + 1]);
        return expect(instance.caret()).to.be.eql([0, 0]);
      });
    });
    describe("#lineText(text, keepSelection) -> string | instance", function() {
      it("should return current selected line text when called without any arguments", function() {
        var text;
        instance.caret(0, 0);
        text = instance.lineText();
        expect(text).to.be.a("string");
        expect(text).to.be.eql("AAAAABBBBBCCCCC");
        instance.caret(5, 25 + 1);
        text = instance.lineText();
        return expect(text).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc");
      });
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.lineText("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.lineText("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should replace single line of caret position when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.lineText("HELLO");
        return expect(value()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333");
      });
      it("should replace single line of caret position and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.lineText("HELLO", true);
        expect(value()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should replace lines of selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(5, 25 + 1);
        result = instance.lineText("HELLO");
        return expect(value()).to.be.eql("HELLO\n111112222233333");
      });
      return it("should replace lines of selection and select replacement when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(5, 25 + 1);
        result = instance.lineText("HELLO", true);
        expect(value()).to.be.eql("HELLO\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
    });
    describe("#insertBefore(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBefore("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertBefore("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text before the caret when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBefore("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text before the caret and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertBefore("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text before the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertBefore("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text before the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertBefore("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
    });
    describe("#insertAfter(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfter("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertAfter("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text after the caret when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfter("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text after the caret and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertAfter("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text after the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertAfter("HELLO");
        return expect(value()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text after the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertAfter("HELLO", true);
        expect(value()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([5, 10]);
      });
    });
    describe("#enclose(lhs, rhs, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.enclose("HELLO", "WORLD");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.enclose("HELLO", "WORLD", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert both text before the caret when no text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.enclose("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert both text before the caret and select insertion when no text is selected and called with three arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 10]);
      });
      it("should enclose the selection with specified when text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 5);
        result = instance.enclose("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should enclose the selection with specified and select text include insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 15]);
      });
      it("should remove specified when selected text (or caret) is enclosed and called with two arguments", function() {
        instance.caret(0, 0);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.caret(5, 10);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should remove specified and select text when selected text (or caret) is enclosed and called with three arguments", function() {
        var caret;
        instance.caret(0, 0);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        expect(caret).to.be.eql([0, 0]);
        instance.caret(5, 10);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([5, 10]);
      });
    });
    describe("#insertBeforeLine(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBeforeLine("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertBeforeLine("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text before the current line when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBeforeLine("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text before the current line and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertBeforeLine("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text before the line of the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertBeforeLine("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text before the line of the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertBeforeLine("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
    });
    describe("#insertAfterLine(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfterLine("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertAfterLine("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text after the current line when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfterLine("HELLO");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text after the current line and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertAfterLine("HELLO", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([15, 20]);
      });
      it("should insert text after the line of the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertAfterLine("HELLO");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text after the line of the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertAfterLine("HELLO", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([15, 20]);
      });
    });
    return describe("#encloseLine(lhs, rhs, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.encloseLine("HELLO", "WORLD");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.encloseLine("HELLO", "WORLD", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert both text before the current line when no text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.encloseLine("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert both text before the current line and select insertion when no text is selected and called with three arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 25]);
      });
      it("should encloseLine the line of the selection with specified when text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 5);
        result = instance.encloseLine("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
      });
      it("should encloseLine the line of the selection with specified and select text include insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 25]);
      });
      it("should remove specified when selected text (or caret) is encloseLined and called with two arguments", function() {
        instance.caret(0, 0);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD");
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.caret(5, 10);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should remove specified and select text when selected text (or caret) is encloseLined and called with three arguments", function() {
        var caret;
        instance.caret(0, 0);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        expect(caret).to.be.eql([0, 15]);
        instance.caret(5, 10);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 15]);
      });
    });
  });

}).call(this);
