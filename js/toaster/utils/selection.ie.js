(function() {
  var IESelection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (document.selection != null) {
    /*
      Textarea selection class for IE
    
      Note:
        You must know the following IE specification to understand this library
    
          1.  A value of TextRange (`text`) does not contain trailing NEWLINEs
          2.  The NEWLINE is composed with two character "\r\n"
          3.  Caret moving functions (like `moveStart`, `moveEnd`) treat NEWLINEs
              as ONE character (position), on the other hand text manipulating
              functions (like `substr`) treat it as TWO character (\r\n)
    
        And there are several more SPECIFICATION written as comments in code.
    */

    IESelection = (function(_super) {

      __extends(IESelection, _super);

      function IESelection(textarea) {
        this.textarea = textarea;
        this._document = this.textarea.ownerDocument;
      }

      IESelection.prototype._getWholeText = function() {
        return this.textarea.value.replace(/\r/g, '');
      };

      IESelection.prototype._getCaret = function() {
        var e, marker, normalizedLength, range, s, textarea, trange;
        s = e = 0;
        textarea = this.textarea;
        range = this._document.selection.createRange();
        if (range && range.parentElement() === textarea) {
          normalizedLength = textarea.value.replace(/\r/g, '').length;
          trange = textarea.createTextRange();
          trange.moveToBookmark(range.getBookmark());
          marker = textarea.createTextRange();
          marker.collapse(false);
          if (trange.compareEndPoints('StartToEnd', marker) > -1) {
            s = e = normalizedLength;
          } else {
            s = -trange.moveStart('character', -normalizedLength);
            if (trange.compareEndPoints('EndToEnd', marker) > -1) {
              e = normalizedLength;
            } else {
              e = -trange.moveEnd('character', -normalizedLength);
            }
          }
        }
        return [s, e];
      };

      IESelection.prototype._setCaret = function(s, e) {
        var range;
        range = this.textarea.createTextRange();
        range.collapse(true);
        range.moveStart('character', s);
        range.moveEnd('character', e - s);
        range.select();
        return this;
      };

      return IESelection;

    })(Femto.utils.W3CSelection);
    namespace('Femto.utils', function(exports) {
      exports.IESelection = IESelection;
      return exports.Selection = IESelection;
    });
  }

}).call(this);
