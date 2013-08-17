(function() {
  var Indent,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Indent = (function() {

    function Indent(textarea, options) {
      this.textarea = textarea;
      this._keyDownEvent = __bind(this._keyDownEvent, this);

      this.options = Femto.utils.extend(options, {
        'expandTab': true,
        'indentLevel': 4
      });
      this._newlinep = new RegExp("^(?:" + (this._makeTabString(this.options.indentLevel)) + ")*");
      this._leadingp = new RegExp("^\\s*");
      this.caret = new Femto.utils.Caret(this.textarea);
      this.linecaret = new Femto.utils.LineCaret(this.textarea);
    }

    Indent.prototype._makeTabString = function(level) {
      var name;
      if (this.options.expandTab) {
        name = "_tabString" + level + "Cache";
        if (!(this[name] != null)) {
          this[name] = new Array(level + 1).join(" ");
        }
        return this[name];
      } else {
        return "\t";
      }
    };

    Indent.prototype._leadingSpaces = function(line) {
      return line.match(this._leadingp)[0].length;
    };

    Indent.prototype.indent = function() {
      var e, indentLine, l, le, lines, ls, modified, offset, offsete, offsets, protrudedSpaces, rels, s, selection, tabString, _ref, _ref1,
        _this = this;
      selection = this.caret.text();
      _ref = this.caret.get(), s = _ref[0], e = _ref[1];
      _ref1 = this.linecaret.get(), ls = _ref1[0], le = _ref1[1];
      if (!this.caret.isCollapsed() && selection.indexOf("\n") !== -1) {
        indentLine = function(line) {
          var leadingSpaces, protrudedSpaces, tabString;
          if (_this.options.expandTab) {
            leadingSpaces = _this._leadingSpaces(line);
            protrudedSpaces = leadingSpaces % _this.options.indentLevel;
            tabString = _this._makeTabString(_this.options.indentLevel - protrudedSpaces);
          } else {
            tabString = _this._makeTabString();
          }
          return tabString + line;
        };
        lines = this.linecaret.text().split("\n");
        modified = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = lines.length; _i < _len; _i++) {
            l = lines[_i];
            _results.push(indentLine(l));
          }
          return _results;
        })();
        this.linecaret.text(modified.join("\n"), false);
        offsets = modified[0].length - lines[0].length;
        offsete = modified.join("").length - lines.join("").length;
        if (ls !== s) {
          s += offsets;
        }
        this.caret.set(s, e + offsete);
      } else {
        if (this.options.expandTab) {
          rels = s - ls;
          protrudedSpaces = rels % this.options.indentLevel;
          tabString = this._makeTabString(this.options.indentLevel - protrudedSpaces);
        } else {
          tabString = this._makeTabString();
        }
        offset = tabString.length;
        this.caret.text(tabString + selection, false);
        this.caret.set(s + offset, e + offset);
      }
      return this;
    };

    Indent.prototype.outdent = function() {
      var e, index, l, le, leadingSpaces, lhs, lines, ls, modified, offset, offsete, offsets, outdentLine, protrudedSpaces, rels, rhs, s, selection, tabString, _ref, _ref1,
        _this = this;
      selection = this.caret.text();
      _ref = this.caret.get(), s = _ref[0], e = _ref[1];
      _ref1 = this.linecaret.get(), ls = _ref1[0], le = _ref1[1];
      if (!this.caret.isCollapsed() && selection.indexOf("\n") !== -1) {
        outdentLine = function(line) {
          var leadingSpaces, protrudedSpaces, tabString;
          if (_this.options.expandTab) {
            leadingSpaces = _this._leadingSpaces(line);
            protrudedSpaces = leadingSpaces % _this.options.indentLevel;
            tabString = _this._makeTabString(_this.options.indentLevel - protrudedSpaces);
          } else {
            tabString = _this._makeTabString();
          }
          return line.replace(new RegExp("^" + tabString), "");
        };
        lines = this.linecaret.text().split("\n");
        modified = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = lines.length; _i < _len; _i++) {
            l = lines[_i];
            _results.push(outdentLine(l));
          }
          return _results;
        })();
        this.linecaret.text(modified.join("\n"), false);
        offsets = modified[0].length - lines[0].length;
        offsete = modified.join("").length - lines.join("").length;
        if (ls !== s) {
          s += offsets;
        }
        this.caret.set(s, e + offsete);
      } else {
        if (this.options.expandTab) {
          leadingSpaces = this._leadingSpaces(selection);
          rels = s - ls + leadingSpaces;
          protrudedSpaces = rels % this.options.indentLevel;
          tabString = this._makeTabString(this.options.indentLevel - protrudedSpaces);
        } else {
          tabString = this._makeTabString();
        }
        selection = this.linecaret.text();
        index = selection.lastIndexOf(tabString, s - ls);
        if (index === -1) {
          return this;
        }
        offset = tabString.length;
        lhs = selection.substring(0, index);
        rhs = selection.substring(index + offset);
        this.linecaret.text(lhs + rhs, false);
        this.caret.set(s - offset, e - offset);
      }
      return this;
    };

    Indent.prototype.insertNewLine = function() {
      var e, indent, insert, ls, s, wholeText, _ref;
      _ref = this.caret.get(), s = _ref[0], e = _ref[1];
      wholeText = this.textarea.value;
      ls = wholeText.lastIndexOf('\n', e - 1) + 1;
      indent = wholeText.substring(ls, e).match(this._newlinep);
      insert = "\n" + indent;
      this.caret.insertAfter(insert, false);
      if (s === e) {
        this.caret.set(s + insert.length, s + insert.length);
      } else {
        this.caret.set(s, e + insert.length);
      }
      return this;
    };

    Indent.prototype._keyDownEvent = function(e) {
      if (e.which !== 9 && e.which !== 13) {
        return true;
      }
      if (e.which === 9) {
        if (e.shiftKey) {
          this.outdent();
        } else {
          this.indent();
        }
      } else if (e.which === 13) {
        if (e.shiftKey) {
          return true;
        }
        this.insertNewLine();
      }
      e.stopPropagation();
      e.preventDefault();
      return false;
    };

    Indent.prototype.enable = function() {
      this.textarea.addEventListner('keydown', this._keyDownEvent, false);
      return this;
    };

    Indent.prototype.disable = function() {
      this.textarea.removeEventListner('keydown', this._keyDownEvent, false);
      return this;
    };

    return Indent;

  })();

  namespace('Femto.utils', function(exports) {
    return exports.Indent = Indent;
  });

}).call(this);
