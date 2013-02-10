
describe('Widget', function() {
  var expected_methods, method, _i, _len, _results;
  it('should return jQuery instance', function() {
    var instance;
    instance = Widget();
    return expect(instance).to.be.a(jQuery);
  });
  it('should return same (but extended) jQuery instance when it specified', function() {
    var div, instance;
    div = jQuery('<div>');
    instance = Widget(div);
    return expect(instance).to.be.eql(div);
  });
  it('should have `widget` property', function() {
    var instance;
    instance = Widget();
    expect(instance).to.have.property('widget');
    return expect(instance.widget).to.be.eql(true);
  });
  expected_methods = ['nonContentWidth', 'nonContentHeight', 'outerWidth', 'outerHeight'];
  _results = [];
  for (_i = 0, _len = expected_methods.length; _i < _len; _i++) {
    method = expected_methods[_i];
    _results.push((function(method) {
      return it("return instance should have `" + method + "` method", function() {
        var instance;
        instance = Widget();
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    })(method));
  }
  return _results;
});
