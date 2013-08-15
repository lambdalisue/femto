
/*
Create continuous spaces
*/


(function() {
  var Shifter, makeTabString,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  makeTabString = function(level) {
    var cache;
    cache = "" + level + "Cache";
    if (!(makeTabString[cache] != null)) {
      makeTabString[cache] = new Array(level + 1).join(" ");
    }
    return makeTabString[cache];
  };

  /*
  A text indent management class
  */


  Shifter = (function() {
    /*
      Constructor
    
      @param [Object] textarea a textarea jQuery instance or DOM element
      @param [Object] selection a instance of Selection of the textarea
      @param [Boolean] expandTab if true, use space instead of tab for indent
      @param [Integer] indentLevel an indent level. enable only when expandTab is `true`
    */

    function Shifter(textarea, selection, expandTab, indentLevel) {
      var tabString;
      this.textarea = textarea;
      this.selection = selection;
      this.expandTab = expandTab != null ? expandTab : true;
      this.indentLevel = indentLevel != null ? indentLevel : 4;
      this._keyDownEvent = __bind(this._keyDownEvent, this);

      if (!(this.textarea instanceof jQuery)) {
        this.textarea = jQuery(this.textarea);
      }
      if (this.expandTab) {
        tabString = makeTabString(this.indentLevel);
      } else {
        tabString = "\t";
      }
      this._pattern = new RegExp("^(?:" + tabString + ")*");
    }

    /*
      Insert tabString at the current caret position
      or start point of the selection
    
      @return [Object] the instance
    */


    Shifter.prototype.indent = function() {
      var ce, collapsed, cs, diff, indentSingleLine, l, le, ls, modified, offset_e, offset_s, rels, selected, tabLength, tabString, _ref, _ref1,
        _this = this;
      collapsed = this.selection.isCollapsed();
      selected = this.selection.text();
      _ref = this.selection.caret(), cs = _ref[0], ce = _ref[1];
      _ref1 = this.selection.lineCaret(), ls = _ref1[0], le = _ref1[1];
      if (!collapsed && selected.indexOf("\n") !== -1) {
        indentSingleLine = function(lineText) {
          var diff, leadingSpaces, tabString;
          if (_this.expandTab) {
            leadingSpaces = lineText.length - lineText.replace(/^\s*/, '').length;
            diff = leadingSpaces % _this.indentLevel;
            tabString = makeTabString(_this.indentLevel - diff);
          } else {
            tabString = "\t";
          }
          return tabString + lineText;
        };
        selected = this.selection.lineText().split("\n");
        modified = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selected.length; _i < _len; _i++) {
            l = selected[_i];
            _results.push(indentSingleLine(l));
          }
          return _results;
        })();
        this.selection.lineText(modified.join("\n"), false);
        offset_s = modified[0].length - selected[0].length;
        offset_e = modified.join("").length - selected.join("").length;
        if (ls !== cs) {
          cs += offset_s;
        }
        this.selection.caret(cs, ce + offset_e);
      } else {
        if (this.expandTab) {
          rels = cs - ls;
          diff = rels % this.indentLevel;
          tabString = makeTabString(this.indentLevel - diff);
        } else {
          tabString = "\t";
        }
        tabLength = tabString.length;
        this.selection.text(tabString + selected, false);
        this.selection.caret(cs + tabLength, ce + tabLength);
      }
      return this;
    };

    /*
      Remove tabString at the current caret position
      or the left hand of the selection
    
      It will not do anything if no tabString is found
    
      @return [Object] the instance
    */


    Shifter.prototype.outdent = function() {
      var a, b, ce, collapsed, cs, diff, index, l, le, leadingSpaces, lineText, ls, modified, offset_e, offset_s, outdentSingleLine, rels, selected, tabLength, tabString, _ref, _ref1,
        _this = this;
      collapsed = this.selection.isCollapsed();
      selected = this.selection.text();
      lineText = this.selection.lineText();
      _ref = this.selection.caret(), cs = _ref[0], ce = _ref[1];
      _ref1 = this.selection.lineCaret(), ls = _ref1[0], le = _ref1[1];
      if (!collapsed && selected.indexOf("\n") !== -1) {
        outdentSingleLine = function(lineText) {
          var diff, leadingSpaces, tabString;
          if (_this.expandTab) {
            leadingSpaces = lineText.length - lineText.replace(/^\s*/, '').length;
            diff = leadingSpaces % _this.indentLevel;
            tabString = makeTabString(_this.indentLevel - diff);
          } else {
            tabString = "\t";
          }
          return lineText.replace(new RegExp("^" + tabString), "");
        };
        selected = this.selection.lineText().split("\n");
        modified = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selected.length; _i < _len; _i++) {
            l = selected[_i];
            _results.push(outdentSingleLine(l));
          }
          return _results;
        })();
        this.selection.lineText(modified.join("\n"), false);
        offset_s = selected[0].length - modified[0].length;
        offset_e = selected.join("").length - modified.join("").length;
        if (ls !== cs) {
          cs -= offset_s;
        }
        this.selection.caret(cs, ce - offset_e);
      } else {
        if (this.expandTab) {
          leadingSpaces = selected.length - selected.replace(/^\s*/, '').length;
          rels = cs - ls + leadingSpaces;
          diff = rels % this.indentLevel;
          tabString = makeTabString(this.indentLevel - diff);
        } else {
          tabString = "\t";
        }
        tabLength = tabString.length;
        index = lineText.lastIndexOf(tabString, cs - ls);
        if (index === -1) {
          return this;
        }
        b = lineText.substring(0, index);
        a = lineText.substring(index + tabString.length);
        this.selection.lineText(b + a, false);
        this.selection.caret(cs - tabLength, ce - tabLength);
      }
      return this;
    };

    /*
      Insert newline after the current caret position
      with appropriate indent characters (keep previous indent level)
    
      @return [Object] the instance
    */


    Shifter.prototype.insertNewLine = function() {
      var e, indent, insert, ls, s, text, _ref;
      _ref = this.selection.caret(), s = _ref[0], e = _ref[1];
      text = this.selection._getWholeText();
      ls = text.lastIndexOf('\n', e - 1) + 1;
      indent = text.slice(ls, e).match(this._pattern);
      insert = "\n" + indent;
      this.selection.insertAfter(insert, false);
      if (s === e) {
        this.selection.caret(s + insert.length, s + insert.length);
      } else {
        this.selection.caret(s, e + insert.length);
      }
      return this;
    };

    Shifter.prototype._keyDownEvent = function(e) {
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
      return false;
    };

    /*
      Enable TAB key indent feature on target textarea
    
      @return [Object] the instance
    */


    Shifter.prototype.enable = function() {
      this.textarea.on('keydown', this._keyDownEvent);
      return this;
    };

    /*
      Disable TAB key indent feature on target textarea
    
      @return [Object] the instance
    */


    Shifter.prototype.disable = function() {
      this.textarea.off('keydown', this._keyDownEvent);
      return this;
    };

    return Shifter;

  })();

  namespace('Femto.utils', function(exports) {
    return exports.Shifter = Shifter;
  });

}).call(this);
