describe 'Femto.utils.Selection', ->
  Selection = Femto.utils.Selection
  textarea = instance = null

  isIE = document.selection?

  normalizedValue = ->
    textarea.value.replace(/\r\n/g, '\n')
  rollback = ->
    textarea.value = 'aaaa\nbbbb\ncccc\n'

  before ->
    textarea = document.createElement('textarea')
    rollback()

    instance = new Selection(textarea)
    document.body.appendChild textarea
    textarea.focus()

  after ->
    document.body.removeChild(textarea)

  afterEach ->
    rollback()

  # check expected private methods
  expected_private_methods = [
    '_getCaret', '_setCaret', '_replace',
  ]
  for method in expected_private_methods then do (method) ->
    it "instance should have private `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  # check expected public methods
  expected_methods = [
    'caret', 'text', 'lineCaret', 'lineText',
    'isCollapsed', 'collapse',
    'insertBefore', 'insertAfter', 'enclose'
    'insertBeforeLine', 'insertAfterLine', 'encloseLine'
  ]
  for method in expected_methods then do (method) ->
    it "instance should have public `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')


  describe '#caret(s, e) -> [s, e] I instance', ->
    it 'should return current caret position as a list when called without any arguments', ->
      # in case, make sure the caret stands on [0, 0]
      instance.caret(0, 0)
      caret = instance.caret()
      expect(caret).to.be.a('array')
      expect(caret).to.be.eql([0, 0])

    it 'should return the instance when called with arguments', ->
      # with s, e
      result = instance.caret(0, 0)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

      # with s
      result = instance.caret(0)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it 'should change caret position to specified when called with two arguments', ->
      caret = instance.caret(1, 2).caret()
      expect(caret).to.be.eql([1, 2])

    it 'should change caret position with specified offset when called with one argument', ->
      pcaret = instance.caret(0, 0).caret()
      ncaret = instance.caret(5).caret()
      expect(ncaret).to.be.eql([pcaret[0]+5, pcaret[1]+5])

    it 'should return [2, 2] when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      instance.caret(2, 2)
      caret = instance.caret()
      expect(caret).to.be.eql([2, 2])

    it 'should return [2, 4] when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---I
      instance.caret(2, 4)
      caret = instance.caret()
      expect(caret).to.be.eql([2, 4])

    it 'should return [4, 4] (before Newline) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         I
      instance.caret(4, 4)
      caret = instance.caret()
      expect(caret).to.be.eql([4, 4])

    it 'should return [5, 5] (after Newline) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      instance.caret(5, 5)
      caret = instance.caret()
      expect(caret).to.be.eql([5, 5])

    it 'should return [6, 6] (two char after from Newline) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             I
      #
      instance.caret(6, 6)
      caret = instance.caret()
      expect(caret).to.be.eql([6, 6])

    it 'should return [10, 10] (before 2nd Newline) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      #
      instance.caret(10, 10)
      caret = instance.caret()
      expect(caret).to.be.eql([10, 10])

    it 'should return [11, 11] (after 2nd Newline) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      #
      instance.caret(11, 11)
      caret = instance.caret()
      expect(caret).to.be.eql([11, 11])

    it 'should return [4, 5] (Newline) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         I-I
      instance.caret(4, 5)
      caret = instance.caret()
      expect(caret).to.be.eql([4, 5])

    it 'should return [2, 7] (include Newline) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.caret(2, 7)
      caret = instance.caret()
      expect(caret).to.be.eql([2, 7])

    it 'should return [2, 12] (include two Newlines) when caret set to', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------------------I
      instance.caret(2, 12)
      caret = instance.caret()
      expect(caret).to.be.eql([2, 12])

  describe '#isCollapsed() -> boolean', ->
    it 'should return true when the start and end points of the selection are the same', ->
      instance.caret(0, 0)
      expect(instance.isCollapsed()).to.be.true
      instance.caret(5, 5)
      expect(instance.isCollapsed()).to.be.true

    it 'should return false when the start and end points of the selection are not the same', ->
      instance.caret(0, 1)
      expect(instance.isCollapsed()).to.be.false
      instance.caret(5, 6)
      expect(instance.isCollapsed()).to.be.true


  describe '#collapse(toStart) -> instance', ->
    it 'should moves the start point of the selection to its end point and return the instance when called without argument', ->
      instance.caret(0, 7)
      r = instance.collapse()
      [s, e] = instance.caret()
      expect(r).to.be.a(Selection)
      expect(r).to.be.eql(instance)
      expect([s, e]).to.be.eql([7, 7])

    it 'should moves the end point of the selection to its start point and return the instance when called with argument (True)', ->
      instance.caret(0, 7)
      r = instance.collapse(true)
      [s, e] = instance.caret()
      expect(r).to.be.a(Selection)
      expect(r).to.be.eql(instance)
      expect([s, e]).to.be.eql([0, 0])

  describe '#text(text, keepSelection) -> string I instance', ->
    it 'should return current selected text when called without any arguments', ->
      instance.caret(0, 0)  # reset caret

      text = instance.text()
      expect(text).to.be.a('string')
      expect(text).to.be.eql('')

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #       I-------I
      instance.caret(3, 7)
      text = instance.text()
      expect(text).to.be.eql("a\nbb")

    it 'should return the instance when called with arguments', ->
      instance.caret(0, 0)  # reset caret

      result = instance.text('HELLO')
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.text('HELLO', true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it 'should insert text before the caret when no text is selected and called with one argument', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret
      #  H E L L O a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      result = instance.text("HELLO")
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 5])

    it "should insert text before the caret and select insertion when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      result = instance.text("HELLO", true)
      #  H E L L O a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should replace text of selected when text is selected and called with one argument", ->
      instance.caret(2, 11)  # reset caret
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-----------------I
      result = instance.text("HELLO")
      #  a a H E L L O c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      expect(normalizedValue()).to.be.eql("aaHELLOccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([7, 7])

    it "should replace text of selected and select replacement when text is selected and called with two arguments", ->
      instance.caret(2, 11)  # reset caret
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-----------------I
      result = instance.text("HELLO", true)
      #  a a H E L L O c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      expect(normalizedValue()).to.be.eql("aaHELLOccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([2, 7])

  describe "#lineCaret(s, e) -> [s, e]", ->
    it "should return current line caret position as a list when called without any arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      instance.caret(2, 2)  # reset caret
      # it is line caret so End is same as the end of current line
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.a("array")
      expect(lcaret).to.be.eql([0, 4])
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             I---------I
      instance.caret(6, 11)  # reset caret
      # it is line caret so End is same as the end of current line
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-----------------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([5, 14])

    it "should return specified line caret position as a list when called with arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret
      # assumed as below
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      # it is line caret so End is same as the end of current line
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.lineCaret(2, 2)
      expect(lcaret).to.be.a("array")
      expect(lcaret).to.be.eql([0, 4])
      # current caret has not changed
      expect(instance.caret()).to.be.eql([0, 0])

    it 'should return line caret [0, 4] for caret [2, 2]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      instance.caret(2, 2)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([0, 4])

    it 'should return line caret [0, 4] for caret [1, 3]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   I---I
      instance.caret(1, 3)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([0, 4])

    it 'should return line caret [0, 4] for caret [0, 4]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      instance.caret(0, 4)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([0, 4])

    it 'should return line caret [5, 9] for caret [7, 7]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      instance.caret(7, 7)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([5, 9])

    it 'should return line caret [5, 9] for caret [6, 8]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #             I---I
      instance.caret(6, 8)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([5, 9])

    it 'should return line caret [5, 9] for caret [5, 9]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      instance.caret(5, 9)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I-------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([5, 9])

    it 'should return line caret [0, 9] for caret [2, 7]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.caret(2, 7)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([0, 9])

    it 'should return line caret [0, 9] for caret [0, 9]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      instance.caret(0, 9)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([0, 9])

    it 'should return line caret [0, 9] for caret [0, 5]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      instance.caret(0, 5)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([0, 9])

    it 'should return line caret [0, 14] for caret [0, 10]', ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------------------I
      instance.caret(0, 10)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------------------------I
      lcaret = instance.lineCaret()
      expect(lcaret).to.be.eql([0, 14])


  describe "#lineText(text, keepSelection) -> string I instance", ->
    it "should return current selected line text when called without any arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret
      text = instance.lineText()
      expect(text).to.be.a("string")
      expect(text).to.be.eql("aaaa")

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.caret(2, 7)
      text = instance.lineText()
      expect(text).to.be.eql("aaaa\nbbbb")

    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.lineText("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.lineText("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should replace single line of caret position when no text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret
      result = instance.lineText("HELLO")
      #  H E L L O N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      expect(normalizedValue()).to.be.eql("HELLO\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 5])
      rollback()
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      instance.caret(7, 7)  # reset caret
      result = instance.lineText("HELLO")
      #  a a a a N H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      expect(normalizedValue()).to.be.eql("aaaa\nHELLO\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([10, 10])

    it "should replace single line of caret position and select insertion when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret
      result = instance.lineText("HELLO", true)
      #  H E L L O N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      expect(normalizedValue()).to.be.eql("HELLO\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should replace lines of selection when text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-----------I
      instance.caret(2, 8)  # reset caret

      #  H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      result = instance.lineText("HELLO")
      expect(normalizedValue()).to.be.eql("HELLO\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 5])

    it "should replace lines of selection and select replacement when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-----------I
      instance.caret(2, 8)  # reset caret

      #  H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      result = instance.lineText("HELLO", true)
      expect(normalizedValue()).to.be.eql("HELLO\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

  describe "#insertBefore(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBefore("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.insertBefore("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text before the caret when no text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret

      #  H E L L O a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      result = instance.insertBefore("HELLO")
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 5])

    it "should insert text before the caret and select insertion when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret

      #  H E L L O a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      result = instance.insertBefore("HELLO", true)
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should insert text before the selection when text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---I
      instance.caret(2, 4)  # reset caret

      #  a a H E L L O a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      result = instance.insertBefore("HELLO")
      expect(normalizedValue()).to.be.eql("aaHELLOaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([7, 7])

    it "should insert text before the selection and select insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---I
      instance.caret(2, 4)  # reset caret

      #  a a H E L L O a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      result = instance.insertBefore("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaHELLOaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([2, 7])


  describe "#insertAfter(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfter("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.insertAfter("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text after the caret when no text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret

      #  H E L L O a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I
      result = instance.insertAfter("HELLO")
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 5])

    it "should insert text after the caret and select insertion when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret

      #  H E L L O a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------I
      result = instance.insertAfter("HELLO", true)
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should insert text after the selection when text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   I---I
      instance.caret(1, 3)  # reset caret

      #  a a a H E L L O a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                 I
      result = instance.insertAfter("HELLO")
      expect(normalizedValue()).to.be.eql("aaaHELLOa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([8, 8])

    it "should insert text after the selection and select insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   I---I
      instance.caret(1, 3)  # reset caret

      #  a a a H E L L O a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #       I---------I
      result = instance.insertAfter("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaHELLOa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([3, 8])


  describe "#enclose(lhs, rhs, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.enclose("HELLO", "WORLD")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.enclose("HELLO", "WORLD", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert both text before the caret when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret

      #  H E L L O W O R L D a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      result = instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("HELLOWORLDaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([10, 10])

    it "should insert both text before the caret and select insertion when no text is selected and called with three arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret

      #  H E L L O W O R L D a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------------------I
      result = instance.enclose("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("HELLOWORLDaaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 10])

    it "should enclose the selection with specified when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   I---I
      instance.caret(1, 3)  # reset caret

      #  a H E L L O a a W O R L D a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                           I
      result = instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("aHELLOaaWORLDa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([13, 13])

    it "should enclose the selection with specified and select text include insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   I---I
      instance.caret(1, 3)  # reset caret

      #  a H E L L O a a W O R L D a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #   I-----------------------I
      result = instance.enclose("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("aHELLOaaWORLDa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([1, 13])

    it "should remove specified when selected text (or caret) is enclosed and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.caret(0, 0)  # reset caret
      #  H E L L O W O R L D a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-------------------I
      instance.enclose("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I
      instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 0])

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.caret(2, 7)  # reset caret
      #  a a H E L L O a a N b b W O R L D b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      #     I-----------------------------I
      instance.enclose("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      instance.enclose("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([7, 7])

    it "should remove specified and select text when selected text (or caret) is enclosed and called with three arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.caret(2, 7)  # reset caret
      #  a a H E L L O a a N b b W O R L D b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      #     I-----------------------------I
      instance.enclose("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.enclose("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([2, 7])


  describe "#insertBeforeLine(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBeforeLine("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.insertBeforeLine("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text before the current line when no text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      instance.caret(7, 7)  # reset caret
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      result = instance.insertBeforeLine("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([10, 10])

    it "should insert text before the current line and select insertion when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      instance.caret(7, 7)
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I---------I
      result = instance.insertBeforeLine("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 10])

    it "should insert text before the line of the selection when text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I-----------I
      instance.caret(7, 13)  # reset caret
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                     I
      result = instance.insertBeforeLine("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([10, 10])

    it "should insert text before the line of the selection and select insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I-----------I
      instance.caret(7, 13)  # reset caret
      #  a a a a N H E L L O b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #           I---------I
      result = instance.insertBeforeLine("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 10])


  describe "#insertAfterLine(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfterLine("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.insertAfterLine("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text after the current line when no text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      instance.caret(7, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             I
      result = instance.insertAfterLine("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([14, 14])

    it "should insert text after the current line and select insertion when no text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #               I
      instance.caret(7, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   I---------I
      result = instance.insertAfterLine("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([9, 14])

    it "should insert text after the line of the selection when text is selected and called with one argument", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.caret(2, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             I
      result = instance.insertAfterLine("HELLO")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([14, 14])

    it "should insert text after the line of the selection and select insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I---------I
      instance.caret(2, 7)  # reset caret
      #  a a a a N b b b b H E L L O N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   I---------I
      result = instance.insertAfterLine("HELLO", true)
      expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([9, 14])


  describe "#encloseLine(lhs, rhs, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.encloseLine("HELLO", "WORLD")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      rollback()

      result = instance.encloseLine("HELLO", "WORLD", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should encloseLine the line of the selection with specified when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      instance.caret(2, 2)  # reset caret
      #  H E L L O a a a a W O R L D N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                             I
      result = instance.encloseLine("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("HELLOaaaaWORLD\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([14, 14])
      rollback()

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      instance.caret(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      #                                       I
      result = instance.encloseLine("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbbWORLD\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([19, 19])

    it "should encloseLine the line of the selection with specified and select text include insertion when text is selected and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      instance.caret(2, 2)  # reset caret
      #  H E L L O a a a a W O R L D N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------------------------I
      result = instance.encloseLine("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("HELLOaaaaWORLD\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 14])
      rollback()

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      instance.caret(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      # I-------------------------------------I
      result = instance.encloseLine("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbbWORLD\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 19])

    it "should remove specified when selected text (or caret) is encloseLined and called with two arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I
      instance.caret(2, 2)  # reset caret
      #  H E L L O a a a a W O R L D N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I---------------------------I
      instance.encloseLine("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #         I
      instance.encloseLine("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([4, 4])

      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      instance.caret(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      # I-------------------------------------I
      instance.encloseLine("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                   I
      instance.encloseLine("HELLO", "WORLD")
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([9, 9])

    it "should remove specified and select text when selected text (or caret) is encloseLined and called with three arguments", ->
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #     I-------I
      instance.caret(2, 6)  # reset caret
      #  H E L L O a a a a N b b b b W O R L D N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
      # I-------------------------------------I
      instance.encloseLine("HELLO", "WORLD", true)
      #  a a a a N b b b b N c c c c N
      # 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      # I-----------------I
      instance.encloseLine("HELLO", "WORLD", true)
      expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 9])
