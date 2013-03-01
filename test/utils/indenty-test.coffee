describe 'Femto.utils.Indenty', ->
  textarea = instance = selection = value = null
  Indenty = Femto.utils.Indenty
  Selection = Femto.utils.Selection

  before ->
    textarea = document.createElement('textarea')
    textarea.rollback = ->
      @value = 'AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333'
    textarea.rollback()
    value = ->
      # IE use \r\n so replace it
      textarea.value.replace(/\r\n/g, "\n")
    instance = new Indenty(jQuery(textarea), true, 4)
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
    'indent', 'outdent',
    'enable', 'disable',
  ]
  for method in expected_methods then do (method) ->
    it "instance should have public `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')


  describe '#indent() -> instance', ->
    it 'should return the instance', ->
      r = instance.indent()
      expect(r).to.be.a(Indenty)
      expect(r).to.be.eql(instance)

    #it 'should insert 4 spaces before the caret', ->
    it 'should insert appropriate number of spaces before the caret', ->
      selection.caret(0, 0)
      instance.indent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      instance.indent()
      expect(value()).to.be.eql("        AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

      selection.caret(5, 5)
      instance.indent()
      #
      # Note:
      #   Caret start from 5 so only 3 spaces (indentLevel - 5 % 4 = 3) are
      #   inserted before the caret
      #
      #expect(value()).to.be.eql("AAAAA    BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAA   BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      instance.indent()
      #expect(value()).to.be.eql("AAAAA        BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAA       BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

      selection.caret(15, 15)
      instance.indent()
      #
      # Note:
      #   Caret start from 15 so only 1 space (indentLevel - 15 % 4 = 1) is
      #   inserted before the caret
      #
      #expect(value()).to.be.eql("AAAAABBBBBCCCCC    \naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC \naaaaabbbbbccccc\n111112222233333")
      instance.indent()
      #expect(value()).to.be.eql("AAAAABBBBBCCCCC        \naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC     \naaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

      selection.caret(16, 16)
      instance.indent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333")
      instance.indent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

    #it 'should insert 4 spaces before the selection when selection is in single line', ->
    it 'should insert appropriate number of spaces before the selection when selection is in single line', ->
      selection.caret(0, 5)
      instance.indent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      instance.indent()
      expect(value()).to.be.eql("        AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

      selection.caret(5, 10)
      instance.indent()
      #
      # Note:
      #   Caret start from 5 so only 3 spaces (indentLevel - 5 % 4 = 3) are
      #   inserted before the caret
      #
      #expect(value()).to.be.eql("AAAAA    BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAA   BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      instance.indent()
      #
      # Note:
      #   Caret indicate the RANGE so `indent()` does not move the start point
      #   of the selection, that's why even after calling `indent()`, caret
      #   start from 5 so only 3 spaces (indentLevel - 5 % 4 = 3) are inserted
      #   before the caret. This is a little bit tricky behavior
      #
      #expect(value()).to.be.eql("AAAAA        BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAA      BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

      selection.caret(16, 21)
      instance.indent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333")
      instance.indent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

    it 'should insert 4 spaces before each selected line when selection is in multi lines', ->
      selection.caret(5, 20)
      instance.indent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333")
      instance.indent()
      expect(value()).to.be.eql("        AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n111112222233333")
      textarea.rollback()

      selection.caret(20, 35)
      instance.indent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333")
      instance.indent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n        111112222233333")
      textarea.rollback()

      selection.caret(5, 35)
      instance.indent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333")
      instance.indent()
      expect(value()).to.be.eql("        AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n        111112222233333")

    it 'should move the caret to the end point of the insertion', ->
      selection.caret(0, 0)
      instance.indent()
      expect(selection.caret()).to.be.eql([4, 4])
      instance.indent()
      expect(selection.caret()).to.be.eql([8, 8])
      textarea.rollback()

      selection.caret(5, 5)
      instance.indent()
      #
      # Note:
      #   Caret start from 5 so only 3 spaces (indentLevel - 5 % 4 = 3) are
      #   inserted before the caret.
      #
      #expect(selection.caret()).to.be.eql([9, 9])
      expect(selection.caret()).to.be.eql([8, 8])
      instance.indent()
      #expect(selection.caret()).to.be.eql([13, 13])
      expect(selection.caret()).to.be.eql([12, 12])
      textarea.rollback()

      selection.caret(15, 15)
      instance.indent()
      #
      # Note:
      #   Caret start from 15 so only 1 space (indentLevel - 15 % 4 = 3) is
      #   inserted before the caret.
      #
      #expect(value()).to.be.eql("AAAAABBBBBCCCCC    \naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC \naaaaabbbbbccccc\n111112222233333")
      #expect(selection.caret()).to.be.eql([19, 19])
      expect(selection.caret()).to.be.eql([16, 16])
      instance.indent()
      #expect(value()).to.be.eql("AAAAABBBBBCCCCC        \naaaaabbbbbccccc\n111112222233333")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC     \naaaaabbbbbccccc\n111112222233333")
      #expect(selection.caret()).to.be.eql([23, 23])
      expect(selection.caret()).to.be.eql([20, 20])
      textarea.rollback()

      selection.caret(16, 16)
      instance.indent()
      expect(selection.caret()).to.be.eql([20, 20])
      instance.indent()
      expect(selection.caret()).to.be.eql([24, 24])
      textarea.rollback()


    it 'should move the selection when selection is in multi lines', ->
      selection.caret(5, 20)
      instance.indent()
      expect(selection.caret()).to.be.eql([0, 39])
      instance.indent()
      expect(selection.caret()).to.be.eql([0, 47])
      textarea.rollback()

      selection.caret(20, 35)
      instance.indent()
      expect(selection.caret()).to.be.eql([16, 55])
      instance.indent()
      expect(selection.caret()).to.be.eql([16, 63])

      textarea.rollback()
      selection.caret(5, 35)
      instance.indent()
      expect(selection.caret()).to.be.eql([0, 59])
      instance.indent()
      expect(selection.caret()).to.be.eql([0, 71])


  describe '#outdent() -> instance', ->
    it 'should return the instance', ->
      r = instance.outdent()
      expect(r).to.be.a(Indenty)
      expect(r).to.be.eql(instance)

    it 'should not do anything when no tabString exists', ->
      caret_set = [
        [0, 0]
        [5, 5]
        [0, 5]
        [5, 10]
        [16, 21]
      ]
      for [s, e] in caret_set
        selection.caret(s, e)
        instance.outdent()
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it 'should remove tabString when the start point of the selection stands on the tabString and the selection is in single line', ->
      textarea.value = "    AAAAABBBBBCCCCC"
      selection.caret(2, 2)
      instance.outdent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC")

      textarea.value = "    AAAAABBBBBCCCCC"
      selection.caret(2, 8)
      instance.outdent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC")

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc"
      selection.caret(22, 22)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc")

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc"
      selection.caret(22, 28)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc")

    it 'should remove only one tabString even there are two when the start point of the selection stands on the tabString and the selection is in single line', ->
      textarea.value = "        AAAAABBBBBCCCCC"
      selection.caret(2, 2)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC")

      textarea.value = "        AAAAABBBBBCCCCC"
      selection.caret(2, 8)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC")

      textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc"
      selection.caret(22, 22)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc")

      textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc"
      selection.caret(22, 28)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc")

    it 'should remove tabString of the left hand side of the selection is in single line', ->
      textarea.value = "    AAAAABBBBBCCCCC"
      selection.caret(5, 5)
      instance.outdent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC")

      textarea.value = "    AAAAABBBBBCCCCC"
      selection.caret(8, 8)
      instance.outdent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC")

      textarea.value = "    AAAAABBBBBCCCCC"
      selection.caret(5, 8)
      instance.outdent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC")

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc"
      selection.caret(25, 25)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc")

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc"
      selection.caret(25, 28)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc")

    it 'should remove only one tabString of the left hand side of the selection even there are two and when the selection is in single line', ->
      textarea.value = "        AAAAABBBBBCCCCC"
      selection.caret(9, 9)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC")

      textarea.value = "        AAAAABBBBBCCCCC"
      selection.caret(12, 12)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC")

      textarea.value = "        AAAAABBBBBCCCCC"
      selection.caret(9, 12)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC")

      textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc"
      selection.caret(29, 29)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc")

      textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc"
      selection.caret(29, 32)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc")

    it 'should remove tabString of the left and side of the each lines when the selection is in multi line', ->
      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333"
      selection.caret(10, 30)
      instance.outdent()
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n    111112222233333")

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333"
      selection.caret(30, 50)
      instance.outdent()
      expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it 'should move the caret to the removed point when the selection is in single line', ->
      textarea.value = "    AAAAABBBBBCCCCC"
      selection.caret(2, 2)
      instance.outdent()
      expect(selection.caret()).to.be.eql([0, 0])

      textarea.value = "    AAAAABBBBBCCCCC"
      selection.caret(2, 8)
      instance.outdent()
      expect(selection.caret()).to.be.eql([0, 0])

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc"
      selection.caret(22, 22)
      instance.outdent()
      expect(selection.caret()).to.be.eql([20, 20])

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc"
      selection.caret(22, 28)
      instance.outdent()
      expect(selection.caret()).to.be.eql([20, 20])

    it 'should move the line selection after outdent when the selection is in multi line', ->
      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333"
      selection.caret(10, 30)
      instance.outdent()
      expect(selection.caret()).to.be.eql([0,31])

      textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333"
      selection.caret(30, 50)
      instance.outdent()
      expect(selection.caret()).to.be.eql([20,51])

  describe '!KeyDown event', ->
    it 'should call `indent()` when user hit TAB', ->
      # TAB = 9
      e = jQuery.Event('keydown', {which: 9})
      indent = instance.indent
      instance.indent = -> @indent.called = true
      instance.indent.called = false
      # trigger
      $(textarea).trigger(e)
      # the method should be called
      expect(instance.indent.called).to.be.true
      # reset the method
      instance.indent = indent

    it 'should call `outdent()` when user hit Shift+TAB', ->
      # TAB = 9
      e = jQuery.Event('keydown', {which: 9, shiftKey: true})
      outdent = instance.outdent
      instance.outdent = -> @outdent.called = true
      instance.outdent.called = false
      # trigger
      $(textarea).trigger(e)
      # the method should be called
      expect(instance.outdent.called).to.be.true
      # reset the method
      instance.outdent = outdent
