#<< editor

describe 'Editor', ->
  textarea = instance = null

  before ->
    textarea = jQuery('<textarea>')
    instance = Editor(textarea)

  it 'should return jQuery instance', ->
    expect(instance).to.be.a(jQuery)

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

  expected_properties = [
    ['textarea', jQuery]
    ['caretaker', utils.Caretaker]
  ]
  for [name, type] in expected_properties then do (name, type) ->
    it "return instance should have `#{name}` property as `#{type.name}`", ->
      expect(instance).to.have.property(name)
      expect(instance[name]).to.be.a(type)

  expected_methods = [
    'adjust', 'val',
  ]
  for method in expected_methods then do (method) ->
    it "return instance should have `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  describe '#textarea : An extended jQuery instance', ->
    it 'should have `widget` property', ->
      expect(instance.textarea).to.have.property('widget')
      expect(instance.textarea.widget).to.be.eql(true)

    expected_methods = [
      'createMemento', 'setMemento',
    ]
    for method in expected_methods then do (method) ->
      it "should have `#{method}` method", ->
        expect(instance.textarea).to.have.property(method)
        expect(instance.textarea[method]).to.be.a('function')

    save_trigger_keys = [
      ['Return',    13]
      ['Tab',       9]
      ['Backspace', 8]
      ['Delete',    46]
    ]
    for [name, key] in save_trigger_keys then do (name, key) ->
      it "should call `caretaker.save()` method when user press #{name}"

    save_trigger_actions = [
      ['paste',     null]
      ['drop',      null]
    ]
    for [name, action] in save_trigger_actions then do (name, action) ->
      it "should call `caretaker.save()` method when user #{name} text"

    describe '#createMemento() -> value', ->
      it 'should return current value of the textarea', ->
        textarea.val('HELLO')
        r = textarea.createMemento()
        expect(r).to.be.eql('HELLO')
        textarea.val('HELLO2')
        r = textarea.createMemento()
        expect(r).to.be.eql('HELLO2')
        # restore
        textarea.val('')

    describe '#setMemento(value) -> instance', ->
      it 'should return the instance', ->
        r = textarea.setMemento('')
        expect(r).to.be.eql(textarea)

      it 'should change current value of the textarea', ->
        textarea.setMemento('HELLO')
        expect(textarea.val()).to.be.eql('HELLO')
        textarea.setMemento('HELLO2')
        expect(textarea.val()).to.be.eql('HELLO2')
        # restore
        textarea.val('')

  describe '#caretaker : utils.Caretaker instance', ->
    it 'should use `textarea` as an originator', ->
      originator = instance.caretaker.originator()
      expect(originator).to.be.eql(instance.textarea)

  describe '#val(value) -> value | instance', ->
    it 'should return current value of the textarea when called without any argument', ->
      instance.textarea.val("HELLO")
      r = instance.val()
      expect(r).to.be.eql("HELLO")
      instance.textarea.val("HELLO2")
      r = instance.val()
      expect(r).to.be.eql("HELLO2")
      # reset
      instance.textarea.val("")

    it 'should change current value of the textarea when called with an argument', ->
      instance.val("HELLO")
      expect(instance.val()).to.be.eql("HELLO")
      instance.val("HELLO2")
      expect(instance.val()).to.be.eql("HELLO2")
      # reset
      instance.textarea.val("")


  describe '#adjust() -> instance', ->
    it 'should resize `outerWidth` of textarea to `width` of the instance', ->
      instance.adjust()
      width = instance.width()
      outerWidth = instance.textarea.outerWidth(true)
      expect(outerWidth).to.be.eql(width)
    it 'should resize `outerHeight` of textarea to `height` of the instance', ->
      instance.adjust()
      height = instance.height()
      outerHeight = instance.textarea.outerHeight(true)
      expect(outerHeight).to.be.eql(height)
