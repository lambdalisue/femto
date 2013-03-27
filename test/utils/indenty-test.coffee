describe 'Femto.utils.Indenty', ->
  textarea = instance = selection = value = null
  Indenty = Femto.utils.Indenty
  Selection = Femto.utils.Selection

  isIE = document.selection?

  normalizedValue = ->
    textarea.value.replace(/\r\n/g, '\n')
  rollback = ->
    textarea.value = 'aaaa\nbbbb\ncccc\n'

  before ->
    textarea = document.createElement('textarea')
    rollback()
    instance = new Indenty(jQuery(textarea), true, 4)
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

    it 'should insert 4 spaces before the caret [0, 0] and move the caret to [4, 4], [8, 8]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # |
      selection.caret(0, 0)
      #  _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         |
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,4])

      #  _ _ _ _ _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("        aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([8,8])

    it 'should insert 2, 4 spaces before the caret [2, 2] and move the caret to [4, 4], [8, 8]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     |
      selection.caret(2, 2)
      #
      # Note:
      #   Caret start from 2 so only 2 spaces (indentLevel - 2 % 4 = 2) are
      #   inserted before the caret
      #
      #  a a _ _ a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         |
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aa  aa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,4])

      #  a a _ _ _ _ _ _ a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aa      aa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([8,8])

    it 'should insert 4 spaces before the caret [4, 4] (before Newline) and move the caret to [8, 8]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         |
      selection.caret(4, 4)
      #  a a a a _ _ _ _ N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa    \nbbbb\ncccc\n")
      expect(caret).to.be.eql([8,8])

    it 'should insert 4 spaces before the caret [5, 5] (after Newline) and move the caret to [9, 9]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           |
      selection.caret(5, 5)
      #  a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   |
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\n    bbbb\ncccc\n")
      expect(caret).to.be.eql([9,9])

    it 'should insert 4 spaces before the single line selection [0, 4] and move the caret to [4, 8], [8, 12]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # |-------|
      selection.caret(0, 4)
      #  _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         |-------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,8])

      #  _ _ _ _ _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |-------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("        aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([8,12])

    it 'should insert 3, 4 spaces before the selection within a single line [1, 3] and move the caret to [4, 6], [8, 10]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   |---|
      selection.caret(1, 3)
      #  a _ _ _ a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         |---|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("a   aaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,6])
      #  a _ _ _ _ _ _ _ a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |---|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("a       aaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([8,10])

    it 'should insert 4 spaces before each selected lines [0, 9] and move the caret to [0, 17], [0, 25]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # |-----------------|
      selection.caret(0, 9)
      #  _ _ _ _ a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      # |---------------------------------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n")
      expect(caret).to.be.eql([0,17])
      #  _ _ _ _ _ _ _ _ a a a a N _ _ _ _ _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      # |-------------------------------------------------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("        aaaa\n        bbbb\ncccc\n")
      expect(caret).to.be.eql([0,25])

    it 'should insert 4 spaces before each lines contains the selection [2, 7] and move the caret to [6, 15], [10, 23]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     |---------|
      selection.caret(2, 7)
      #  _ _ _ _ a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #             |-----------------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n")
      expect(caret).to.be.eql([6,15])
      #  _ _ _ _ _ _ _ _ a a a a N _ _ _ _ _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      #                     |-------------------------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("        aaaa\n        bbbb\ncccc\n")
      expect(caret).to.be.eql([10,23])

    it 'should insert appropriate number of spaces before each selected lines and move the caret to [0, 26]', ->
      textarea.value = " aaaa\n  bbbb\n   cccc\n"
      #  _ a a a a N _ _ b b b b N _ _ _ c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
      # |---------------------------------------|
      selection.caret(0, 20)
      #  _ _ _ _ a a a a N _ _ _ _ b b b b N _ _ _ _ c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      # |---------------------------------------------------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\n    cccc\n")
      expect(caret).to.be.eql([0,26])

    it 'should insert appropriate number of spaces before each lines contains selection and move the caret to [6, 24]', ->
      textarea.value = " aaaa\n  bbbb\n   cccc\n"
      #  _ a a a a N _ _ b b b b N _ _ _ c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
      #       |-----------------------------|
      selection.caret(3, 18)
      #  _ _ _ _ a a a a N _ _ _ _ b b b b N _ _ _ _ c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #             |-----------------------------------|
      instance.indent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\n    cccc\n")
      expect(caret).to.be.eql([6,24])

  describe '#outdent() -> instance', ->
    it 'should return the instance', ->
      r = instance.outdent()
      expect(r).to.be.a(Indenty)
      expect(r).to.be.eql(instance)

    it 'should remove 4 spaces before the caret [8, 8] and move the caret to [4, 4], [0, 0]', ->
      textarea.value = "        aaaa\nbbbb\ncccc\n"
      #  _ _ _ _ _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |
      selection.caret(8, 8)
      #  _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #         |
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,4])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      # |
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([0,0])

    it 'should remove 2, 4 spaces before the caret [6, 6] and move the caret to [2, 2], [0, 0]', ->
      textarea.value = "      aaaa\nbbbb\ncccc\n"
      #  _ _ _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             |
      selection.caret(6, 6)
      #  _ _ _ _ a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #         |
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,4])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      # |
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([0,0])

    it 'should remove 4 spaces before the caret [8, 8] (before Newline) and move the caret to [4, 4]', ->
      textarea.value = "aaaa    \nbbbb\ncccc\n"
      #  a a a a _ _ _ _ N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |
      selection.caret(8, 8)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #         |
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,4])

    it 'should remove 4 spaces before the caret [9, 9] (after Newline) and move the caret to [5, 5]', ->
      textarea.value = "aaaa\n    bbbb\ncccc\n"
      #  a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   |
      selection.caret(9, 9)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #           |
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([5,5])

    it 'should remove 4 spaces before the single line selection [8, 12] and move the caret to [4, 8], [0, 4]', ->
      textarea.value = "        aaaa\nbbbb\ncccc\n"
      #  _ _ _ _ _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 |-------|
      selection.caret(8, 12)
      #  _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #         |-------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([4,8])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      # |-------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([0,4])

    it 'should remove 3, 4 spaces before the single line selection [5, 9] and move the caret to [1, 5], [0, 1]', ->
      textarea.value = "        aaaa\nbbbb\ncccc\n"
      #  _ _ _ _ _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           |-------|
      selection.caret(5, 9)
      #  _ _ _ _ a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      #   |-------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([1,5])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      # |-|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([0,1])

    it 'should remove 4 spaces before each selected lines [0, 25] and move the caret to [0, 17], [0, 9]', ->
      textarea.value = "        aaaa\n        bbbb\ncccc\n"
      #  _ _ _ _ _ _ _ _ a a a a N _ _ _ _ _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      # |-------------------------------------------------|
      selection.caret(0, 25)
      #  _ _ _ _ a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      # |---------------------------------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n")
      expect(caret).to.be.eql([0,17])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      # |-----------------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([0,9])

    it 'should remove 2, 4 spaces before each lines contains [0, 29] and move the caret to [0, 25], [0, 17], [0, 9]', ->
      textarea.value = "          aaaa\n          bbbb\ncccc\n"
      #  _ _ _ _ _ _ _ _ _ _ a a a a N _ _ _ _ _ _ _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
      # |---------------------------------------------------------|
      selection.caret(0, 29)
      #  _ _ _ _ _ _ _ _ a a a a N _ _ _ _ _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      # |-------------------------------------------------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("        aaaa\n        bbbb\ncccc\n")
      expect(caret).to.be.eql([0,25])
      #  _ _ _ _ a a a a N _ _ _ _ b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      # |---------------------------------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n")
      expect(caret).to.be.eql([0,17])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6
      # |-----------------|
      instance.outdent()
      caret = selection.caret()
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      expect(caret).to.be.eql([0,9])

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
