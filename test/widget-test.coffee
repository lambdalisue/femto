describe 'Femto.widget.Widget', ->
  Widget = Femto.widget.Widget
  it 'should return jQuery instance', ->
    instance = Widget()
    expect(instance).to.be.a(jQuery)

  it 'should return same (but extended) jQuery instance when it specified', ->
    div = jQuery('<div>')
    instance = Widget(div)
    expect(instance).to.be.eql(div)

  it 'should have `widget` property', ->
    instance = Widget()
    expect(instance).to.have.property('widget')
    expect(instance.widget).to.be.eql(true)

  expected_methods = [
    'nonContentWidth', 'nonContentHeight',
    'outerWidth', 'outerHeight',
  ]
  for method in expected_methods then do (method) ->
    it "return instance should have `#{method}` method", ->
      instance = Widget()
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')
