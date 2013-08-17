(function() {
  var clone, extend;

  clone = function(a) {
    var k, newObj, v;
    newObj = {};
    for (k in a) {
      v = a[k];
      if (a.hasOwnProperty(k)) {
        newObj[k] = v;
      }
    }
    return newObj;
  };

  extend = function(a, b) {
    var k, v;
    b = clone(b);
    for (k in a) {
      v = a[k];
      if (a.hasOwnProperty(k)) {
        b[k] = v;
      }
    }
    return b;
  };

  namespace('Femto.utils', function(exports) {
    exports.clone = clone;
    return exports.extend = extend;
  });

}).call(this);
