#<< utils/selection
#<< utils/selection.ie
describe 'utils.Selection', ->
  textarea = instance = value = null
  Selection = utils.Selection

  before ->
    textarea = document.createElement('textarea')
    textarea.rollback = ->
      @value = 'AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333'
    textarea.rollback()
    value = ->
      # IE use \r\n so replace it
      textarea.value.replace(/\r\n/g, "\n")
    instance = new Selection(textarea)
    document.body.appendChild textarea
    textarea.focus()

  afterEach ->
    textarea.rollback()

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


  describe '#caret(s, e) -> [s, e] | instance', ->
    it 'should return current caret position as a list when called without any arguments', ->
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
      instance.caret(0, 10)
      r = instance.collapse()
      [s, e] = instance.caret()
      expect(r).to.be.a(Selection)
      expect(r).to.be.eql(instance)
      expect(s).to.be.eql(10)
      expect(e).to.be.eql(10)

    it 'should moves the start point of the selection to its end point and return the instance when called with argument', ->
      instance.caret(0, 10)
      r = instance.collapse(true)
      [s, e] = instance.caret()
      expect(r).to.be.a(Selection)
      expect(r).to.be.eql(instance)
      expect(s).to.be.eql(0)
      expect(e).to.be.eql(0)

  describe '#text(text, keepSelection) -> string | instance', ->
    it 'should return current selected text when called without any arguments', ->
      instance.caret(0, 0)  # reset caret

      text = instance.text()
      expect(text).to.be.a('string')
      expect(text).to.be.eql('')

      instance.caret(5, 25 + 1)
      text = instance.text()
      expect(text).to.be.eql("BBBBBCCCCC\naaaaabbbbb")

    it 'should return the instance when called with arguments', ->
      instance.caret(0, 0)  # reset caret

      result = instance.text('HELLO')
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.text('HELLO', true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it 'should insert text before the caret when no text is selected and called with one argument', ->
      instance.caret(0, 0)  # reset caret
      result = instance.text("HELLO")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert text before the caret and select insertion when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret
      result = instance.text("HELLO", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should replace text of selected when text is selected and called with one argument", ->
      instance.caret(3, 12)  # reset caret

      result = instance.text("HELLO")
      expect(value()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333")

    it "should replace text of selected and select replacement when text is selected and called with two arguments", ->
      instance.caret(3, 12)  # reset caret

      result = instance.text("HELLO", true)
      expect(value()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([3, 8])


  describe "#lineCaret(s, e) -> [s, e]", ->
    it "should return current line caret position as a list when called without any arguments", ->
      instance.caret(5, 25 + 1)  # reset caret

      lcaret = instance.lineCaret()
      expect(lcaret).to.be.a("array")
      # it is line caret so End is same as the end of current line
      expect(lcaret).to.be.eql([0, 30 + 1])

    it "should return specified line caret position as a list when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      lcaret = instance.lineCaret(5, 25 + 1)
      expect(lcaret).to.be.a("array")
      # it is line caret so End is same as the end of current line
      expect(lcaret).to.be.eql([0, 30 + 1])
      # current caret has not changed
      expect(instance.caret()).to.be.eql([0, 0])


  describe "#lineText(text, keepSelection) -> string | instance", ->
    it "should return current selected line text when called without any arguments", ->
      instance.caret(0, 0)  # reset caret

      text = instance.lineText()
      expect(text).to.be.a("string")
      expect(text).to.be.eql("AAAAABBBBBCCCCC")

      instance.caret(5, 25 + 1)
      text = instance.lineText()
      expect(text).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc")

    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.lineText("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.lineText("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should replace single line of caret position when no text is selected and called with one argument", ->
      instance.caret(0, 0)  # reset caret

      result = instance.lineText("HELLO")
      expect(value()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333")

    it "should replace single line of caret position and select insertion when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret
      result = instance.lineText("HELLO", true)
      expect(value()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should replace lines of selection when text is selected and called with one argument", ->
      instance.caret(5, 25 + 1)  # reset caret

      result = instance.lineText("HELLO")
      expect(value()).to.be.eql("HELLO\n111112222233333")

    it "should replace lines of selection and select replacement when text is selected and called with two arguments", ->
      instance.caret(5, 25 + 1)  # reset caret
      result = instance.lineText("HELLO", true)
      expect(value()).to.be.eql("HELLO\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

  describe "#insertBefore(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBefore("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.insertBefore("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text before the caret when no text is selected and called with one argument", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBefore("HELLO")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert text before the caret and select insertion when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBefore("HELLO", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should insert text before the selection when text is selected and called with one argument", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertBefore("HELLO")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert text before the selection and select insertion when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertBefore("HELLO", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])


  describe "#insertAfter(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfter("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.insertAfter("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text after the caret when no text is selected and called with one argument", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfter("HELLO")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert text after the caret and select insertion when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfter("HELLO", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should insert text after the selection when text is selected and called with one argument", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertAfter("HELLO")
      expect(value()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert text after the selection and select insertion when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertAfter("HELLO", true)
      expect(value()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 10])


  describe "#enclose(lhs, rhs, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.enclose("HELLO", "WORLD")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.enclose("HELLO", "WORLD", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert both text before the caret when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.enclose("HELLO", "WORLD")
      expect(value()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert both text before the caret and select insertion when no text is selected and called with three arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.enclose("HELLO", "WORLD", true)
      expect(value()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 10])

    it "should enclose the selection with specified when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.enclose("HELLO", "WORLD")
      expect(value()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should enclose the selection with specified and select text include insertion when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.enclose("HELLO", "WORLD", true)
      expect(value()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 15])

    it "should remove specified when selected text (or caret) is enclosed and called with two arguments", ->
      instance.caret(0, 0)  # reset caret
      instance.enclose("HELLO", "WORLD", true)
      instance.enclose("HELLO", "WORLD")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

      instance.caret(5, 10)  # reset caret
      instance.enclose("HELLO", "WORLD", true)
      instance.enclose("HELLO", "WORLD")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should remove specified and select text when selected text (or caret) is enclosed and called with three arguments", ->
      instance.caret(0, 0)  # reset caret
      instance.enclose("HELLO", "WORLD", true)
      instance.enclose("HELLO", "WORLD", true)
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 0])

      instance.caret(5, 10)  # reset caret
      instance.enclose("HELLO", "WORLD", true)
      instance.enclose("HELLO", "WORLD", true)
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([5, 10])


  describe "#insertBeforeLine(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBeforeLine("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.insertBeforeLine("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text before the current line when no text is selected and called with one argument", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBeforeLine("HELLO")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert text before the current line and select insertion when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertBeforeLine("HELLO", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])

    it "should insert text before the line of the selection when text is selected and called with one argument", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertBeforeLine("HELLO")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should insert text before the line of the selection and select insertion when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertBeforeLine("HELLO", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 5])


  describe "#insertAfterLine(text, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfterLine("HELLO")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.insertAfterLine("HELLO", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert text after the current line when no text is selected and called with one argument", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfterLine("HELLO")
      expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333")

    it "should insert text after the current line and select insertion when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.insertAfterLine("HELLO", true)
      expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([15, 20])

    it "should insert text after the line of the selection when text is selected and called with one argument", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertAfterLine("HELLO")
      expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333")

    it "should insert text after the line of the selection and select insertion when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.insertAfterLine("HELLO", true)
      expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([15, 20])


  describe "#encloseLine(lhs, rhs, keepSelection) -> instance", ->
    it "should return the instance when called with arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.encloseLine("HELLO", "WORLD")
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)
      textarea.rollback()

      result = instance.encloseLine("HELLO", "WORLD", true)
      expect(result).to.be.a(Selection)
      expect(result).to.be.eql(instance)

    it "should insert both text before the current line when no text is selected and called with two arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.encloseLine("HELLO", "WORLD")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333")

    it "should insert both text before the current line and select insertion when no text is selected and called with three arguments", ->
      instance.caret(0, 0)  # reset caret

      result = instance.encloseLine("HELLO", "WORLD", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 25])

    it "should encloseLine the line of the selection with specified when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.encloseLine("HELLO", "WORLD")
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333")

    it "should encloseLine the line of the selection with specified and select text include insertion when text is selected and called with two arguments", ->
      instance.caret(0, 5)  # reset caret

      result = instance.encloseLine("HELLO", "WORLD", true)
      expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 25])

    it "should remove specified when selected text (or caret) is encloseLined and called with two arguments", ->
      instance.caret(0, 0)  # reset caret
      instance.encloseLine("HELLO", "WORLD", true)
      instance.encloseLine("HELLO", "WORLD")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

      instance.caret(5, 10)  # reset caret
      instance.encloseLine("HELLO", "WORLD", true)
      instance.encloseLine("HELLO", "WORLD")
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")

    it "should remove specified and select text when selected text (or caret) is encloseLined and called with three arguments", ->
      instance.caret(0, 0)  # reset caret
      instance.encloseLine("HELLO", "WORLD", true)
      instance.encloseLine("HELLO", "WORLD", true)
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 15])

      instance.caret(5, 10)  # reset caret
      instance.encloseLine("HELLO", "WORLD", true)
      instance.encloseLine("HELLO", "WORLD", true)
      expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333")
      caret = instance.caret()
      expect(caret).to.be.eql([0, 15])
