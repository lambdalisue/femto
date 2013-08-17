(function() {
  var typeOf;

  typeOf = function(obj) {
    if (obj === null) {
      return "null";
    }
    if (obj === void 0) {
      return "undefined";
    }
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  };

  namespace('Femto.utils', function(exports) {
    return exports.typeOf = typeOf;
  });

}).call(this);
