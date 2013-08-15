describe 'Femto.widgets.editor', ->
  editor = Femto.widgets.editor
  textarea = instance = null

  before ->
    textarea = jQuery('<textarea>')
    instance = editor(textarea, null,
      {'expandTab': true, 'indentLevel': 4})

  it 'should return jQuery instance', ->
    expect(instance).to.be.a(jQuery)

  it 'should have `widget` property and it should be "editor"', ->
    expect(instance).to.have.property('widget')
    expect(instance.widget).to.be.eql('editor')

  expected_classname = [
    'panel', 'editor',
  ]
  for name in expected_classname then do (name) ->
    it "should have `#{name}` class in its DOM element", ->
      expect(instance.hasClass(name)).to.be.true

  it 'DOM element should have `textarea` DOM element in it', ->
    children = instance.children()
    expect(children.length).to.be.eql(1)
    expect(children[0]).to.be.eql(instance.textarea[0])

  # check expected public properties
  expected_properties = [
    ['textarea', jQuery]
    ['caretaker', Femto.utils.Caretaker]
    ['selection', Femto.utils.Selection]
    ['shifter', Femto.utils.Shifter]
  ]
  for [name, type] in expected_properties then do (name, type) ->
    it "instance should have public `#{name}` property", ->
      expect(instance).to.have.property(name)
      expect(instance[name]).to.be.a(type) if type?

  expected_methods = [
    'focus', 'blar', 'val',
  ]
  for method in expected_methods then do (method) ->
    it "return instance should have `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  describe '#textarea : An extended jQuery instance', ->
    it 'should have `widget` property and it should be "textarea"', ->
      expect(instance.textarea).to.have.property('widget')
      expect(instance.textarea.widget).to.be.eql('textarea')
