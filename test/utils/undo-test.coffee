describe 'Femto.utils.Originator', ->
  Originator = Femto.utils.Originator
  Caretaker = Femto.utils.Caretaker
  expected_methods = [
    'createMemento', 'setMemento'
  ]
  for method in expected_methods then do (method) ->
    it "instance should have `#{method}` method", ->
      instance = new Originator()
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')


describe 'Femto.utils.Caretaker', ->
  Originator = Femto.utils.Originator
  Caretaker = Femto.utils.Caretaker
  class Dummy extends Originator
    createMemento: -> return @memento
    setMemento: (memento) -> @memento = memento
  dummy = new Dummy()
  instance = new Caretaker(dummy)

  expected_methods = [
    'originator', 'save', 'undo', 'redo',
    'canUndo', 'canRedo',
  ]
  for method in expected_methods then do (method) ->
    it "instance should have `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  beforeEach ->
    dummy.memento = null
    instance._undoStack = []
    instance._redoStack = []
    instance._previous = null
    instance._originator = dummy

  describe '#originator(originator) -> originator | instance', ->

    it 'should return originator instance when called without any argument', ->
      r = instance.originator()
      expect(r).to.be.a(Dummy)
      expect(r).to.be.eql(dummy)

    it 'should change originator and return the instance when called with a argument', ->
      class Dummy2 extends Dummy
        createMemento: -> return @memento + @memento
      dummy2 = new Dummy2()
      r = instance.originator(dummy2)
      expect(r).to.be.eql(instance)
      o = r.originator()
      expect(o).to.be.a(Dummy2)
      expect(o).to.be.eql(dummy2)

  describe '#save(memento) -> instance', ->
    it 'should return the instance', ->
      r = instance.save()
      expect(r).to.be.eql(instance)

      r = instance.save('HELLO')
      expect(r).to.be.eql(instance)

    it 'should call originator `createMemento()` method to get current memento without any argument', ->
      o = instance.originator()
      createMemento = o.createMemento
      o.createMemento = -> @createMemento.called = true
      o.createMemento.called = false
      instance.save()
      expect(o.createMemento.called).to.be.true
      o.createMemento = createMemento

    it 'should save new memento into `_undoStack` and change `_previous` when called without any argument', ->
      dummy.memento = 'HELLO'
      instance.save()
      # Caretaker automatically add "" stack to make sure that the undoStack
      # starts from empty statement
      expect(instance._undoStack.length).to.be.eql(2)
      expect(instance._undoStack[0]).to.be.eql('')
      expect(instance._undoStack[1]).to.be.eql('HELLO')
      expect(instance._previous).to.be.eql('HELLO')

    it 'should save specified memento into `_undoStack` and change `_previous` when called with a argument', ->
      instance.save('HELLO')
      # Caretaker automatically add "" stack to make sure that the undoStack
      # starts from empty statement
      expect(instance._undoStack.length).to.be.eql(2)
      expect(instance._undoStack[0]).to.be.eql('')
      expect(instance._undoStack[1]).to.be.eql('HELLO')
      expect(instance._previous).to.be.eql('HELLO')

    it 'should `push` a memento into `_undoStack` rather than `unshift`', ->
      instance.save('HELLO1')
      instance.save('HELLO2')
      instance.save('HELLO3')
      expect(instance._undoStack.length).to.be.eql(4)
      expect(instance._undoStack).to.be.eql(['', 'HELLO1', 'HELLO2', 'HELLO3'])

    it 'should not save a memento which is equal with the previous one', ->
      instance.save('HELLO')
      instance.save('HELLO')
      instance.save('HELLO')
      expect(instance._undoStack.length).to.be.eql(2)
      expect(instance._undoStack[0]).to.be.eql('')
      expect(instance._undoStack[1]).to.be.eql('HELLO')

  describe '#undo() -> instance', ->
    it 'should return the instance', ->
      r = instance.undo()
      expect(r).to.be.eql(instance)

    it 'should not do anything when nothing have saved on `_undoStack`', ->
      expect(dummy.memento).to.be.eql(null)
      expect(instance._undoStack.length).to.be.eql(0)
      expect(instance._redoStack.length).to.be.eql(0)
      expect(instance._previous).to.be.eql(null)

      instance.undo()
      expect(dummy.memento).to.be.eql(null)
      expect(instance._undoStack.length).to.be.eql(0)
      expect(instance._redoStack.length).to.be.eql(0)
      expect(instance._previous).to.be.eql(null)

    it 'should call originator `createMemento()` method to get current value', ->
      o = instance.originator()
      createMemento = o.createMemento
      o.createMemento = -> @createMemento.called = true
      o.createMemento.called = false
      instance.undo()
      expect(o.createMemento.called).to.be.true
      o.createMemento = createMemento

    it 'should call originator `setMemento(value)` method to change current value', ->
      o = instance.originator()
      setMemento = o.setMemento
      o.setMemento = -> @setMemento.called = true
      o.setMemento.called = false
      instance.undo()
      expect(o.setMemento.called).to.be.true
      o.setMemento = setMemento

    it 'should pop previous memento from `_undoStack`', ->
      dummy.memento = "HELLO1"
      for i in [2..3]
        instance.save()
        dummy.memento = "HELLO#{i}"
      expect(instance._undoStack).to.be.eql(['', 'HELLO1', 'HELLO2'])
      for i in [3..1]
        expect(dummy.memento).to.be.eql("HELLO#{i}")
        expect(instance._undoStack.length).to.be.eql(i)
        instance.undo()

    it 'should push current memento to `_redoStack`', ->
      dummy.memento = "HELLO1"
      for i in [2..3]
        instance.save()
        dummy.memento = "HELLO#{i}"
      for i in [3..1]
        expect(instance._redoStack.length).to.be.eql(3-i)
        instance.undo()
      expect(dummy.memento).to.be.eql('')
      expect(instance._redoStack).to.be.eql(['HELLO3', 'HELLO2', 'HELLO1'])

  describe '#redo() -> instance', ->
    it 'should return the instance', ->
      r = instance.redo()
      expect(r).to.be.eql(instance)

    it 'should not do anything when nothing have saved on `_redoStack`', ->
      expect(dummy.memento).to.be.eql(null)
      expect(instance._undoStack.length).to.be.eql(0)
      expect(instance._redoStack.length).to.be.eql(0)
      expect(instance._previous).to.be.eql(null)

      instance.redo()
      expect(dummy.memento).to.be.eql(null)
      expect(instance._undoStack.length).to.be.eql(0)
      expect(instance._redoStack.length).to.be.eql(0)
      expect(instance._previous).to.be.eql(null)

    it 'should call originator `createMemento()` method to get current value', ->
      o = instance.originator()
      createMemento = o.createMemento
      o.createMemento = -> @createMemento.called = true
      o.createMemento.called = false
      instance.redo()
      expect(o.createMemento.called).to.be.true
      o.createMemento = createMemento

    it 'should call originator `setMemento(value)` method to change current value', ->
      o = instance.originator()
      setMemento = o.setMemento
      o.setMemento = -> @setMemento.called = true
      o.setMemento.called = false
      instance.redo()
      expect(o.setMemento.called).to.be.true
      o.setMemento = setMemento

    it 'should pop further memento from `_redoStack`', ->
      dummy.memento = "HELLO1"
      for i in [2..3]
        instance.save()
        dummy.memento = "HELLO#{i}"
      for i in [3..1]
        instance.undo()
      expect(instance._redoStack).to.be.eql(['HELLO3', 'HELLO2', 'HELLO1'])
      expect(dummy.memento).to.be.eql("")
      instance.redo()
      for i in [1..2]
        expect(dummy.memento).to.be.eql("HELLO#{i}")
        expect(instance._redoStack.length).to.be.eql(3-i)
        instance.redo()
      expect(dummy.memento).to.be.eql("HELLO3")

    it 'should push current memento to `_undoStack`', ->
      dummy.memento = "HELLO1"
      for i in [2..3]
        instance.save()
        dummy.memento = "HELLO#{i}"
      for i in [3..1]
        instance.undo()
      expect(dummy.memento).to.be.eql("")
      instance.redo()
      for i in [1..2]
        expect(dummy.memento).to.be.eql("HELLO#{i}")
        expect(instance._undoStack.length).to.be.eql(i)
        instance.redo()
      expect(instance._undoStack).to.be.eql(['', 'HELLO1', 'HELLO2'])

  describe '#canUndo() -> boolean', ->
    it 'should return boolean', ->
      r = instance.canUndo()
      expect(r).to.be.a('boolean')
    it 'should return `false` when `_undoStack` is empty', ->
      r = instance.canUndo()
      expect(r).to.be.false
    it 'should return `true` when `_undoStack` is not empty', ->
      instance.save('HELLO')
      r = instance.canUndo()
      expect(r).to.be.true

  describe '#canRedo() -> boolean', ->
    it 'should return boolean', ->
      r = instance.canRedo()
      expect(r).to.be.a('boolean')
    it 'should return `false` when `_redoStack` is empty', ->
      r = instance.canRedo()
      expect(r).to.be.false
    it 'should return `true` when `_redoStack` is not empty', ->
      instance.save('HELLO')
      instance.undo()
      r = instance.canRedo()
      expect(r).to.be.true
