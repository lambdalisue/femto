#<< widget
describe 'Widget', ->
  it 'should return jQuery instance', ->
    instance = Widget()
    expect(instance).to.be.a(jQuery)

  it 'should return same (but extended) jQuery instance when it specified', ->
    div = jQuery('<div>')
    instance = Widget(div)
    expect(instance).to.be.eql(div)

  expected_methods = [
    'nonContentWidth', 'nonContentHeight',
    'outerWidth', '_outerWidth',
    'outerHeight', '_outerHeight',
  ]
  for method in expected_methods
    it "return instance should have `#{method}` method", ->
      instance = Widget()
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')
