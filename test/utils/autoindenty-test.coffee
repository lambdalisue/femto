describe 'Femto.utils.AutoIndenty', ->
  textarea = instance = selection = value = null
  AutoIndenty = Femto.utils.AutoIndenty
  Selection = Femto.utils.Selection

  before ->
    textarea = document.createElement('textarea')
    textarea.rollback = ->
      @value = 'AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333'
    textarea.rollback()
    value = ->
      # IE use \r\n so replace it
      textarea.value.replace(/\r\n/g, "\n")
    instance = new AutoIndenty(jQuery(textarea), true, 4)
    selection = instance._selection
    document.body.appendChild textarea
    textarea.focus()

  after ->
    document.body.removeChild(textarea)


  afterEach ->
    textarea.rollback()

  # check expected private properties
  expected_private_properties = [
    ['_selection', Selection]
  ]
  for [name, type] in expected_private_properties then do (name, type) ->
    it "instance should have private `#{name}` property", ->
      expect(instance).to.have.property(name)
      expect(instance[name]).to.be.a(type)

  # check expected public properties
  expected_properties = [
    ['textarea', null]
    ['expandTab', 'boolean']
    ['indentLevel', 'number']
  ]
  for [name, type] in expected_properties then do (name, type) ->
    it "instance should have public `#{name}` property", ->
      expect(instance).to.have.property(name)
      expect(instance[name]).to.be.a(type) if type?

  # check expected private methods
  expected_private_methods = [
    '_keyDownEvent',
  ]
  for method in expected_private_methods then do (method) ->
    it "instance should have private `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')
  # check expected public methods
  expected_methods = [
    'insertNewLine',
    'enable', 'disable',
  ]
  for method in expected_methods then do (method) ->
    it "instance should have public `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')


  describe '#insertNewLine() -> instance', ->
    it 'should return the instance', ->
      r = instance.insertNewLine()
      expect(r).to.be.a(AutoIndenty)
      expect(r).to.be.eql(instance)

    it 'should insert newline after the current caret', ->
      selection.caret(15, 15)
      instance.insertNewLine()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n\naaaaabbbbbccccc\n111112222233333")

      textarea.rollback()
      selection.caret(21, 21)
      instance.insertNewLine()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaa\nbbbbbccccc\n111112222233333")


    it 'should insert leading tabString and newline after the current caret if the current line starts from tabString', ->
      textarea.value = "    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"
      selection.caret(19, 19)
      instance.insertNewLine()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n\n    aaaaabbbbbccccc\n111112222233333")

      textarea.value = "AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333"
      selection.caret(25, 25)
      instance.insertNewLine()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaa\n    bbbbbccccc\n111112222233333")

  describe '!KeyDown event', ->
    it 'should call `insertNewLine()` when user hit RETURN', ->
      # RETURN = 13
      e = jQuery.Event('keydown', {which: 13})
      insertNewLine = instance.insertNewLine
      instance.insertNewLine = -> @insertNewLine.called = true
      instance.insertNewLine.called = false
      # trigger
      $(textarea).trigger(e)
      # insertNewLine should be called
      expect(instance.insertNewLine.called).to.be.true
      # reset the method
      instance.insertNewLine = insertNewLine

    it 'should NOT call `insertNewLine()` when user hit Shift+RETURN', ->
      # RETURN = 13
      e = jQuery.Event('keydown', {which: 13, shiftKey: true})
      insertNewLine = instance.insertNewLine
      instance.insertNewLine = -> @insertNewLine.called = true
      instance.insertNewLine.called = false
      selection.caret(0, 0)
      # trigger
      $(textarea).trigger(e)
      # insertNewLine should be called
      expect(instance.insertNewLine.called).to.be.false
      # reset the method
      instance.insertNewLine = insertNewLine
