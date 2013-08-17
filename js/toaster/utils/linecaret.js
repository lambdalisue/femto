(function() {
  var LineCaret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LineCaret = (function(_super) {

    __extends(LineCaret, _super);

    function LineCaret() {
      return LineCaret.__super__.constructor.apply(this, arguments);
    }

    LineCaret.prototype.get = function(s, e) {
      var ce, cs, le, ls, wholeText, _ref;
      if (!(s != null) || !(e != null)) {
        _ref = LineCaret.__super__.get.call(this), cs = _ref[0], ce = _ref[1];
        s = s != null ? s : cs;
        e = e != null ? e : ce;
      }
      wholeText = this.textarea.value;
      ls = wholeText.lastIndexOf("\n", s - 1) + 1;
      le = wholeText.indexOf("\n", e);
      if (le === -1) {
        le = wholeText.length;
      }
      return [ls, le];
    };

    return LineCaret;

  })(Femto.utils.Caret);

  namespace('Femto.utils', function(exports) {
    return exports.LineCaret = LineCaret;
  });

}).call(this);
