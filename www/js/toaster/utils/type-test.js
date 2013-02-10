
describe('utils.type', function() {
  var cases, obj, result, type, _i, _len, _ref, _results;
  type = utils.type;
  cases = [
    [0, 'number'], [1.2, 'number'], [[0, 1], 'array'], [new Array, 'array'], [
      {
        0: 1
      }, 'object'
    ], [null, 'null'], [void 0, 'undefined'], [NaN, 'number']
  ];
  _results = [];
  for (_i = 0, _len = cases.length; _i < _len; _i++) {
    _ref = cases[_i], obj = _ref[0], result = _ref[1];
    _results.push((function(obj, result) {
      return it("should return '" + result + "' for `" + obj + "`", function() {
        return expect(type(obj)).to.be.eql(result);
      });
    })(obj, result));
  }
  return _results;
});
