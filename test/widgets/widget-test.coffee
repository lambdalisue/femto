describe 'Femto.widgets.widget', ->
  widget = Femto.widgets.widget
  it 'should return jQuery instance', ->
    instance = widget()
    expect(instance).to.be.a(jQuery)

  it 'should return same (but extended) jQuery instance when it specified', ->
    div = jQuery('<div>')
    instance = widget(div)
    expect(instance).to.be.eql(div)

  it 'should have `widget` property and it should be "widget"', ->
    instance = widget()
    expect(instance).to.have.property('widget')
    expect(instance.widget).to.be.eql('widget')

  instance = widget()
  expected_methods = [
    'nonContentWidth', 'nonContentHeight',
    'outerWidth', 'outerHeight',
  ]
  for method in expected_methods then do (method) ->
    it "return instance should have `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')
