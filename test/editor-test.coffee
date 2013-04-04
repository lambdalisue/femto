describe 'Femto.widget.Editor', ->
  Editor = Femto.widget.Editor
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
    ['caretaker', Femto.utils.Caretaker]
  ]
  for [name, type] in expected_properties then do (name, type) ->
    it "return instance should have `#{name}` property as `#{type.name}`", ->
      expect(instance).to.have.property(name)
      expect(instance[name]).to.be.a(type)

  expected_methods = [
    'val',
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
      it "should call `caretaker.save()` method when user press #{name}", ->
        e = jQuery.Event('keydown', {which: key})
        save = instance.save
        instance.save = -> @save.called = true
        instance.save.called = false
        # trigger
        instance.textarea.trigger(e)
        # should be called
        expect(instance.save.called).to.be.true
        # reset the method
        instance.save = save

    save_trigger_actions = [
      ['paste',     null]
      ['drop',      null]
    ]
    for [name, action] in save_trigger_actions then do (name, action) ->
      it "should call `caretaker.save()` method when user #{name} text", ->
        e = jQuery.Event(name)
        save = instance.save
        instance.save = -> @save.called = true
        instance.save.called = false
        # trigger
        instance.textarea.trigger(e)
        # should be called
        expect(instance.save.called).to.be.true
        # reset the method
        instance.save = save

    it "should call `caretaker.undo()` method when user press Ctrl+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true})
      undo = instance.undo
      instance.undo = -> @undo.called = true
      instance.undo.called = false
      # trigger
      instance.textarea.trigger(e)
      # should be called
      expect(instance.undo.called).to.be.true
      # reset the method
      instance.undo = undo

    it "should not call `caretaker.undo()` method when user press Ctrl+Shift+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true, shiftKey: true})
      undo = instance.undo
      instance.undo = -> @undo.called = true
      instance.undo.called = false
      # trigger
      instance.textarea.trigger(e)
      # should be called
      expect(instance.undo.called).to.be.false
      # reset the method
      instance.undo = undo

    it "should not call `caretaker.redo()` method when user press Ctrl+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true})
      redo = instance.redo
      instance.redo = -> @redo.called = true
      instance.redo.called = false
      # trigger
      instance.textarea.trigger(e)
      # should be called
      expect(instance.redo.called).to.be.false
      # reset the method
      instance.redo = redo

    it "should call `caretaker.redo()` method when user press Ctrl+Shift+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true, shiftKey: true})
      redo = instance.redo
      instance.redo = -> @redo.called = true
      instance.redo.called = false
      # trigger
      instance.textarea.trigger(e)
      # should be called
      expect(instance.redo.called).to.be.true
      # reset the method
      instance.redo = redo

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