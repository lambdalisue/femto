#<< utils/caret-test

describe 'Femto.utils.LineCaret', ->
  Caret = Femto.utils.Caret
  LineCaret = Femto.utils.LineCaret
  textarea = instance = caret = null

  isIE = document.selection?

  normalizedValue = ->
    textarea.value.replace(/\r\n/g, '\n')
  rollback = ->
    textarea.value = 'aaaa\nbbbb\ncccc\n'

  before ->
    textarea = document.createElement('textarea')
    rollback()

    caret = new Caret(textarea)
    instance = new LineCaret(textarea)
    document.body.appendChild textarea
    textarea.focus()

  after ->
    document.body.removeChild(textarea)

  afterEach ->
    rollback()

  # check expected private methods
  expected_private_methods = [
    '_replace',
  ]
  for method in expected_private_methods then do (method) ->
    it "instance should have private `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  # check expected public methods
  expected_methods = [
    'get', 'set', 'text',
    'isCollapsed', 'collapse',
    'insertBefore', 'insertAfter', 'enclose'
  ]
  for method in expected_methods then do (method) ->
    it "instance should have public `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  describe "#get() -> [s, e]", ->
    it "should return current line caret position as a list", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      caret.set(2, 2)  # reset caret
      # it is line caret so End is same as the end of current line
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.get()
      expect(lcaret).to.be.a("array")
      expect(lcaret).to.be.eql([0, 4])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             I---------I
      caret.set(6, 11)  # reset caret
      # it is line caret so End is same as the end of current line
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-----------------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([5, 14])

    it "should return specified line caret position as a list", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      caret.set(0, 0)  # reset caret
      # assumed as below
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      # it is line caret so End is same as the end of current line
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.get(2, 2)
      expect(lcaret).to.be.a("array")
      expect(lcaret).to.be.eql([0, 4])
      # current caret has not changed
      expect(caret.get()).to.be.eql([0, 0])

    it 'should return line caret [0, 4] for caret [2, 2]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      caret.set(2, 2)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([0, 4])

    it 'should return line caret [0, 4] for caret [1, 3]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   I---I
      caret.set(1, 3)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([0, 4])

    it 'should return line caret [0, 4] for caret [0, 4]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      caret.set(0, 4)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([0, 4])

    it 'should return line caret [5, 9] for caret [7, 7]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      caret.set(7, 7)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([5, 9])

    it 'should return line caret [5, 9] for caret [6, 8]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             I---I
      caret.set(6, 8)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([5, 9])

    it 'should return line caret [5, 9] for caret [5, 9]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      caret.set(5, 9)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([5, 9])

    it 'should return line caret [0, 9] for caret [2, 7]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      caret.set(2, 7)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([0, 9])

    it 'should return line caret [0, 9] for caret [0, 9]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      caret.set(0, 9)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([0, 9])

    it 'should return line caret [0, 9] for caret [0, 5]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      caret.set(0, 5)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([0, 9])

    it 'should return line caret [0, 14] for caret [0, 10]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------------------I
      caret.set(0, 10)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------------------------I
      lcaret = instance.get()
      expect(lcaret).to.be.eql([0, 14])

  describe "#text(text, keepLineCaret) -> string | instance", ->
    it "should return current selected line text when " +\
       "called without any arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      caret.set(0, 0)  # reset caret
      text = instance.text()
      expect(text).to.be.a("string")
      expect(text).to.be.eql("aaaa")

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      caret.set(2, 7)
      text = instance.text()
      expect(text).to.be.eql("aaaa\nbbbb")

    it "should return the instance when called with arguments", ->
      caret.set(0, 0)  # reset caret

      result = instance.text("HELLO")
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.text("HELLO", true)
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)

    it "should replace single line of caret position when no text is " +\
       "selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      caret.set(0, 0)  # reset caret
      result = instance.text("HELLO")
      #  H E L L O N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      expect(normalizedValue()).to.be.eql("HELLO\nbbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([5, 5])
      rollback()
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      caret.set(7, 7)  # reset caret
      result = instance.text("HELLO")
      #  a a a a N H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      expect(normalizedValue()).to.be.eql("aaaa\nHELLO\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([10, 10])

    it "should replace single line of caret position and select " +\
       "insertion when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      caret.set(0, 0)  # reset caret
      result = instance.text("HELLO", true)
      #  H E L L O N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      expect(normalizedValue()).to.be.eql("HELLO\nbbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([0, 5])

    it "should replace lines of selection when text is selected " +\
       "and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-----------I
      caret.set(2, 8)  # reset caret

      #  H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      result = instance.text("HELLO")
      expect(normalizedValue()).to.be.eql("HELLO\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([5, 5])

    it "should replace lines of selection and select replacement when " +\
       "text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-----------I
      caret.set(2, 8)  # reset caret

      #  H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      result = instance.text("HELLO", true)
      expect(normalizedValue()).to.be.eql("HELLO\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([0, 5])

  describe "#insertBefore(text, keepLineCaret) -> instance", ->
    it "should return the instance when called with arguments", ->
      caret.set(0, 0)  # reset caret

      result = instance.insertBefore("HELLO")
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.insertBefore("HELLO", true)
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)

    it "should insert text before the current line when no " +\
       "text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      caret.set(7, 7)  # reset caret
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      result = instance.insertBefore("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([10, 10])

    it "should insert text before the current line and select " +\
       "insertion when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      caret.set(7, 7)
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I---------I
      result = instance.insertBefore("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([5, 10])

    it "should insert text before the line of the selection when " +\
       "text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I-----------I
      caret.set(7, 13)  # reset caret
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      result = instance.insertBefore("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([10, 10])

    it "should insert text before the line of the selection and select " +\
       "insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I-----------I
      caret.set(7, 13)  # reset caret
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I---------I
      result = instance.insertBefore("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([5, 10])


  describe "#insertAfter(text, keepLineCaret) -> instance", ->
    it "should return the instance when called with arguments", ->
      caret.set(0, 0)  # reset caret

      result = instance.insertAfter("HELLO")
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.insertAfter("HELLO", true)
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)

    it "should insert text after the current line when no text is " +\
       "selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      caret.set(7, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             I
      result = instance.insertAfter("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([14, 14])

    it "should insert text after the current line and select insertion " +\
       "when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      caret.set(7, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   I---------I
      result = instance.insertAfter("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([9, 14])

    it "should insert text after the line of the selection when text is " +\
       "selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      caret.set(2, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             I
      result = instance.insertAfter("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([14, 14])

    it "should insert text after the line of the selection and select " +\
       "insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      caret.set(2, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   I---------I
      result = instance.insertAfter("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([9, 14])


  describe "#enclose(lhs, rhs, keepLineCaret) -> instance", ->
    it "should return the instance when called with arguments", ->
      caret.set(0, 0)  # reset caret

      result = instance.enclose("HELLO", "WORLD")
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.enclose("HELLO", "WORLD", true)
      expect(result).to.be.a(LineCaret)
      expect(result).to.be.eql(instance)

    it "should enclose the line of the selection with specified when text " +\
       "is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      caret.set(2, 2)  # reset caret
      #  H E L L O a a a a W O R L D N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             I
      result = instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("HELLOaaaaWORLD\nbbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([14, 14])
      rollback()

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      caret.set(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      #                                       I
      result = instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbbWORLD\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([19, 19])

    it "should enclose the line of the selection with specified and select " +\
       "text include insertion when text is selected and called with two " +\
       "arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      caret.set(2, 2)  # reset caret
      #  H E L L O a a a a W O R L D N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------------------------I
      result = instance.enclose("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("HELLOaaaaWORLD\nbbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([0, 14])
      rollback()

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      caret.set(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      # I-------------------------------------I
      result = instance.enclose("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbbWORLD\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([0, 19])

    it "should remove specified when selected text (or caret) is enclosed " +\
       "and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      caret.set(2, 2)  # reset caret
      #  H E L L O a a a a W O R L D N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------------------------I
      instance.enclose("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         I
      instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([4, 4])

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      caret.set(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      # I-------------------------------------I
      instance.enclose("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   I
      instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([9, 9])

    it "should remove specified and select text when selected text " +\
       "(or caret) is enclosed and called with three arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      caret.set(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      # I-------------------------------------I
      instance.enclose("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      instance.enclose("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      lcaret = caret.get()
      expect(lcaret).to.be.eql([0, 9])
