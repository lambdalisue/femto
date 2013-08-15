describe 'Femto.widgets.textarea', ->
  textarea = Femto.widgets.textarea
  instance = null

  before ->
    instance = textarea('<textarea>', null,
      {'expandTab': true, 'indentLevel': 4})

  it 'should return jQuery instance', ->
    expect(instance).to.be.a(jQuery)

  it 'should have `widget` property and it should be "textarea"', ->
    expect(instance).to.have.property('widget')
    expect(instance.widget).to.be.eql('textarea')

  # check expected private properties
  expected_private_properties = [
    ['_caretaker', Femto.utils.Caretaker]
    ['_selection', Femto.utils.Selection]
    ['_shifter', Femto.utils.Shifter]
  ]
  for [name, type] in expected_private_properties then do (name, type) ->
    it "instance should have private `#{name}` property", ->
      expect(instance).to.have.property(name)
      expect(instance[name]).to.be.a(type) if type?

  expected_methods = [
    'createMemento',
    'setMemento',
    'save', 'undo', 'redo',
    'indent', 'outdent', 'insertNewLine',
  ]
  for method in expected_methods then do (method) ->
    it "return instance should have `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  save_trigger_keys = [
    ['Return',    13]
    ['Tab',       9]
    ['Backspace', 8]
    ['Delete',    46]
  ]
  for [name, key] in save_trigger_keys then do (name, key) ->
    it "should call `_caretaker.save()` method when user press #{name}", ->
      e = jQuery.Event('keydown', {which: key})
      save = instance._caretaker.save
      instance._caretaker.save = -> @save.called = true
      instance._caretaker.save.called = false
      # trigger
      instance.trigger(e)
      # should be called
      expect(instance._caretaker.save.called).to.be.true
      # reset the method
      instance._caretaker.save = save

  save_trigger_actions = [
    ['paste',     null]
    ['drop',      null]
  ]
  for [name, action] in save_trigger_actions then do (name, action) ->
    it "should call `_caretaker.save()` method when user #{name} text", ->
      e = jQuery.Event(name)
      save = instance._caretaker.save
      instance._caretaker.save = -> @save.called = true
      instance._caretaker.save.called = false
      # trigger
      instance.trigger(e)
      # should be called
      expect(instance._caretaker.save.called).to.be.true
      # reset the method
      instance._caretaker.save = save

    it "should call `_caretaker.undo()` method when user press Ctrl+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true})
      undo = instance._caretaker.undo
      instance._caretaker.undo = -> @undo.called = true
      instance._caretaker.undo.called = false
      # trigger
      instance.trigger(e)
      # should be called
      expect(instance._caretaker.undo.called).to.be.true
      # reset the method
      instance._caretaker.undo = undo

    it "should not call `_caretaker.undo()` method when user press Ctrl+Shift+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true, shiftKey: true})
      undo = instance._caretaker.undo
      instance._caretaker.undo = -> @undo.called = true
      instance._caretaker.undo.called = false
      # trigger
      instance.trigger(e)
      # should be called
      expect(instance._caretaker.undo.called).to.be.false
      # reset the method
      instance._caretaker.undo = undo

    it "should not call `_caretaker.redo()` method when user press Ctrl+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true})
      redo = instance._caretaker.redo
      instance._caretaker.redo = -> @redo.called = true
      instance._caretaker.redo.called = false
      # trigger
      instance.trigger(e)
      # should be called
      expect(instance._caretaker.redo.called).to.be.false
      # reset the method
      instance._caretaker.redo = redo

    it "should call `_caretaker.redo()` method when user press Ctrl+Shift+Z", ->
      # Z = 90
      e = jQuery.Event('keydown', {which: 90, ctrlKey: true, shiftKey: true})
      redo = instance._caretaker.redo
      instance._caretaker.redo = -> @redo.called = true
      instance._caretaker.redo.called = false
      # trigger
      instance.trigger(e)
      # should be called
      expect(instance._caretaker.redo.called).to.be.true
      # reset the method
      instance._caretaker.redo = redo

  describe '#createMemento() -> value', ->
    it 'should return current value of the textarea', ->
      instance.val('HELLO')
      r = instance.createMemento()
      expect(r).to.be.eql('HELLO')
      instance.val('HELLO2')
      r = instance.createMemento()
      expect(r).to.be.eql('HELLO2')
      # restore
      instance.val('')

  describe '#setMemento(value) -> instance', ->
    it 'should return the instance', ->
      r = instance.setMemento('')
      expect(r).to.be.eql(instance)

    it 'should change current value of the textarea', ->
      instance.setMemento('HELLO')
      expect(instance.val()).to.be.eql('HELLO')
      instance.setMemento('HELLO2')
      expect(instance.val()).to.be.eql('HELLO2')
      # restore
      instance.val('')

  describe '#save() -> instance', ->
    it 'should call `_caretaker.save()` method', ->
      save = instance._caretaker.save
      instance._caretaker.save = -> @save.called = true
      instance._caretaker.save.called = false
      # trigger
      instance.save()
      # should be called
      expect(instance._caretaker.save.called).to.be.true
      # reset the method
      instance._caretaker.save = save

  describe '#undo() -> instance', ->
    it 'should call `_caretaker.undo()` method', ->
      undo = instance._caretaker.undo
      instance._caretaker.undo = -> @undo.called = true
      instance._caretaker.undo.called = false
      # trigger
      instance.undo()
      # should be called
      expect(instance._caretaker.undo.called).to.be.true
      # reset the method
      instance._caretaker.undo = undo

  describe '#redo() -> instance', ->
    it 'should call `_caretaker.redo()` method', ->
      redo = instance._caretaker.redo
      instance._caretaker.redo = -> @redo.called = true
      instance._caretaker.redo.called = false
      # trigger
      instance.redo()
      # should be called
      expect(instance._caretaker.redo.called).to.be.true
      # reset the method
      instance._caretaker.redo = redo

  describe '#indent() -> instance', ->
    it 'should call `_shifter.indent()` method', ->
      indent = instance._shifter.indent
      instance._shifter.indent = -> @indent.called = true
      instance._shifter.indent.called = false
      # trigger
      instance.indent()
      # should be called
      expect(instance._shifter.indent.called).to.be.true
      # reset the method
      instance._shifter.indent = indent

  describe '#outdent() -> instance', ->
    it 'should call `_shifter.outdent()` method', ->
      outdent = instance._shifter.outdent
      instance._shifter.outdent = -> @outdent.called = true
      instance._shifter.outdent.called = false
      # trigger
      instance.outdent()
      # should be called
      expect(instance._shifter.outdent.called).to.be.true
      # reset the method
      instance._shifter.outdent = outdent

  describe '#insertNewLine() -> instance', ->
    it 'should call `_shifter.insertNewLine()` method', ->
      insertNewLine = instance._shifter.insertNewLine
      instance._shifter.insertNewLine = -> @insertNewLine.called = true
      instance._shifter.insertNewLine.called = false
      # trigger
      instance.insertNewLine()
      # should be called
      expect(instance._shifter.insertNewLine.called).to.be.true
      # reset the method
      instance._shifter.insertNewLine = insertNewLine
