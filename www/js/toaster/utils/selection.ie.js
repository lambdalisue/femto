(function() {
  var occurrences,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (document.selection != null) {
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
    utils.Selection = utils.IESelection = (function(_super) {

      __extends(IESelection, _super);

      function IESelection(textarea) {
        this.textarea = textarea;
        this._document = this.textarea.ownerDocument;
      }

      IESelection.prototype._getWholeText = function() {
        var value;
        value = this.textarea.value;
        value = value.replace(/\r\n/g, "\n");
        return value;
      };

      IESelection.prototype._getCaret = function() {
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

    })(utils.W3CSelection);
  }

}).call(this);
