describe 'Femto.utils.AutoIndenty', ->
  textarea = instance = selection = value = null
  AutoIndenty = Femto.utils.AutoIndenty
  Selection = Femto.utils.Selection

  normalizedValue = ->
    textarea.value.replace(/\r\n/g, '\n')
  rollback = ->
    textarea.value = 'aaaa\nbbbb\ncccc\n'

  before ->
    textarea = document.createElement('textarea')
    rollback()
    instance = new AutoIndenty(jQuery(textarea), true, 4)
    selection = instance._selection
    document.body.appendChild textarea
    textarea.focus()

  after ->
    document.body.removeChild(textarea)

  afterEach ->
    rollback()

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

    it 'should insert newline after the caret [0, 0] and move the caret to [1, 1]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # |
      selection.caret(0, 0)
      #  N a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("\naaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([1, 1])

    it 'should insert newline after the caret [2, 2] and move the caret to [3, 3]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     |
      selection.caret(2, 2)
      #  a a N a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #       |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aa\naa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([3, 3])

    it 'should insert newline after the caret [4, 4] and move the caret to [5, 5]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         |
      selection.caret(4, 4)
      #  a a a a N N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\n\nbbbb\ncccc\n")
      expect(caret).to.be.eql([5, 5])

    it 'should insert newline after the caret [5, 5] and move the caret to [6, 6]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           |
      selection.caret(5, 5)
      #  a a a a N N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\n\nbbbb\ncccc\n")
      expect(caret).to.be.eql([6, 6])

    it 'should insert newline after the caret [7, 7] and move the caret to [8, 8]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               |
      selection.caret(7, 7)
      #  a a a a N b b N b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbb\nbb\ncccc\n")
      expect(caret).to.be.eql([8, 8])

    it 'should insert newline after the caret [14, 14] and move the caret to [15, 15]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             |
      selection.caret(14, 14)
      #  a a a a N b b b b N c c c c N N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                               |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n\n")
      expect(caret).to.be.eql([15, 15])

    it 'should insert newline after the caret [15, 15] and move the caret to [16, 16]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             |
      selection.caret(15, 15)
      #  a a a a N b b b b N c c c c N N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      #                                 |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n\n")
      expect(caret).to.be.eql([16, 16])

    it 'should insert newline after the selection [2, 7] and move the caret to [2, 8]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     |---------|
      selection.caret(2, 7)
      #  a a a a N b b N b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      #     |-----------|
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbb\nbb\ncccc\n")
      expect(caret).to.be.eql([2, 8])

    it 'should insert newline with tabString after the caret [4, 4] and move the caret to [9, 9]', ->
      textarea.value = "    aaaa\n  bbbb\ncccc\n"
      #  _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         |
      selection.caret(4, 4)
      #  _ _ _ _ N _ _ _ _ a a a a N _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    \n    aaaa\n  bbbb\ncccc\n")
      expect(caret).to.be.eql([9, 9])

    it 'should insert newline with tabString after the caret [6, 6] and move the caret to [11, 11]', ->
      textarea.value = "    aaaa\n  bbbb\ncccc\n"
      #  _ _ _ _ a a a a N _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             |
      selection.caret(6, 6)
      #  _ _ _ _ a a N _ _ _ _ a a N _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                       |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aa\n    aa\n  bbbb\ncccc\n")
      expect(caret).to.be.eql([11, 11])

    it 'should insert newline with tabString after the caret [8, 8] and move the caret to [13, 13]', ->
      textarea.value = "    aaaa\n  bbbb\ncccc\n"
      #  _ _ _ _ a a a a N _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |
      selection.caret(8, 8)
      #  _ _ _ _ a a a a N _ _ _ _ N _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                           |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n    \n  bbbb\ncccc\n")
      expect(caret).to.be.eql([13, 13])

    it 'should insert newline after the caret [9, 9] and move the caret to [10, 10]', ->
      textarea.value = "    aaaa\n  bbbb\ncccc\n"
      #  _ _ _ _ a a a a N _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   |
      selection.caret(9, 9)
      # Note: tab indent level is 4, not 2
      #  _ _ _ _ a a a a N N _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     |
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n\n  bbbb\ncccc\n")
      expect(caret).to.be.eql([10, 10])

    it 'should insert newline after the selection [2, 10] and move the selection to [2, 19]', ->
      textarea.value = "        aaaa\n    bbbb\ncccc\n"
      #  _ _ _ _ _ _ _ _ a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
      #     |---------------|
      selection.caret(2, 10)
      #  _ _ _ _ _ _ _ _ a a N _ _ _ _ _ _ _ _ a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
      #     |---------------------------------|
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("        aa\n        aa\n    bbbb\ncccc\n")
      expect(caret).to.be.eql([2, 19])

    it 'should insert newline after the selection [2, 19] and move the selection to [2, 24]', ->
      textarea.value = "        aaaa\n    bbbb\ncccc\n"
      #  _ _ _ _ _ _ _ _ a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
      #     |---------------------------------|
      selection.caret(2, 19)
      #  _ _ _ _ _ _ _ _ a a a a N _ _ _ _ b b N _ _ _ _ b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     |-------------------------------------------|
      instance.insertNewLine()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("        aaaa\n    bb\n    bb\ncccc\n")
      expect(caret).to.be.eql([2, 24])

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
