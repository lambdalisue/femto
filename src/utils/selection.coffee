###
Cross-browser textarea selection class

@example
  textarea = document.createElement('textarea')
  textarea.selection = new Selection(textarea)
  # get current caret position
  [start, end] = textarea.selection.caret()
  # move caret to [1, 5]
  textarea.selection.caret(1, 5)
  # move caret +4
  textarea.selection.caret(4)
  # get selected text
  selected = textarea.selection.text()
  # replace selected text
  textarea.selection.text("HELLO")
###
class W3CSelection
  ###
  Constructor

  @param [DOM element] textarea A target textarea DOM element
  @return [Selection] the new instance
  ###
  constructor: (@textarea) -> @

  # @private
  _getCaret: ->
    s = @textarea.selectionStart
    e = @textarea.selectionEnd
    return [s, e]
  # @private
  _setCaret: (s, e) ->
    @textarea.setSelectionRange(s, e)
    return @

  # @private
  _getWholeText: ->
    return @textarea.value
  # @private
  _setWholeText: (value) ->
    @textarea.value = value
    return @

  # @private
  _replace: (repl, s, e) ->
    v = @_getWholeText()
    b = v.substring 0, s
    a = v.substring e
    @_setWholeText(b + repl + a)

  ###
  Get caret when called without any argument.
  Set caret when called with two arguments.
  Move caret when called with an argument.

  @param [Integer] s a start index of the caret or caret offset
  @param [Integer] e a end index of the caret
  @return [Array, Selection] return [s, e] array when called without any
    arguments. return the instance when called with arguments.
  @note caret will be reset when you change the value of textarea, so
    you have to set caret after you change the value if it's needed
  ###
  caret: (s, e) ->
    if not s?
      return @_getCaret()
    # set caret
    if not e?
      # move caret with the offset
      caret = @_getCaret()
      return @caret(caret[0]+s, caret[1]+s)
    scrollTop = @textarea.scrollTop
    @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Return whether the selection's start and end points are the same position

  @return [Boolean] true when the selection is collapsed
  ###
  isCollapsed: ->
    [s, e] = @_getCaret()
    return s is e

  ###
  Moves the start point of a range to its end point or vica versa

  @param [Boolean] toEnd true to move the end point to the start point
  @return [Selection] instance
  ###
  collapse: (toStart) ->
    [s, e] = @_getCaret()
    if toStart
      @_setCaret(s, s)
    else
      @_setCaret(e, e)
    return @

  ###
  Get selected text when called without any argument.
  Replace selected text when called with arguments.

  @param [String] text a text used to replace the selection
  @param [Boolean] keepSelection select replaced text if it is `true`
  @return [String, Selection] return selected text when called without any
    argument. return the instance when called with arguments
  ###
  text: (text, keepSelection) ->
    [s, e] = @_getCaret()
    if not text?
      # get text
      return @_getWholeText().substring(s, e)
    # set text
    scrollTop = @textarea.scrollTop
    # replace
    @_replace(text, s, e)
    # move caret
    e = s + text.length
    s = e if not keepSelection
    @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Get caret of the line on the current caret when called without any argument.
  Get caret of the line on the specified caret when called with two arguments.

  @param [Integer] s a start index of the caret
  @param [Integer] e an end index of the caret
  @return [Array] return [s, e] array
  ###
  lineCaret: (s, e) ->
    if not s? or not e?
      [ss, ee] = @_getCaret()
      s = s ? ss
      e = e ? ee
    v = @_getWholeText()
    s = v.lastIndexOf("\n", s-1) + 1
    e = v.indexOf("\n", e)
    e = v.length if e is -1
    return [s, e]

  ###
  Get line text of the line caret when called without any argument.
  Replace line text of the line caret when called with arguments.

  @param [String] text a text used to replace the selection
  @param [Boolean] keepSelection select replaced text if it is `true`
  @return [String, Selection] return selected text when called without any
    argument. return the instance when called with arguments
  ###
  lineText: (text, keepSelection) ->
    [s, e] = @lineCaret()
    if not text?
      # get text
      return @_getWholeText().substring(s, e)
    # set text
    scrollTop = @textarea.scrollTop
    # replace
    @_replace text, s, e
    # move caret
    e = s + text.length
    s = e if not keepSelection
    @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Insert text before the selection

  @param [String] text a text used to insert
  @param [Boolean] keepSelection select inserted text if it is `true`
  @return [Selection] return the instance
  ###
  insertBefore: (text, keepSelection) ->
    [s, e] = @_getCaret()
    str = @text()
    # set text
    scrollTop = @textarea.scrollTop
    # replace
    @_replace(text+str, s, e)
    # move caret
    e = s + text.length
    s = e if not keepSelection
    @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Insert text after the selection

  @param [String] text a text used to insert
  @param [Boolean] keepSelection select inserted text if it is `true`
  @return [Selection] return the instance
  ###
  insertAfter: (text, keepSelection) ->
    [s, e] = @_getCaret()
    str = @text()
    # set text
    scrollTop = @textarea.scrollTop
    # replace
    @_replace(str+text, s, e)
    # move caret
    s = e
    e = e + text.length
    s = e if not keepSelection
    @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Enclose selected text or Open the enclosed text

  @param [String] lhs a text used to insert before the selection
  @param [String] rhs a text used to insert after the selection
  @param [Boolean] keepSelection select inserted text if it is `true`
  @return [Selection] return the instance
  ###
  enclose: (lhs, rhs, keepSelection) ->
    text = @text()
    scrollTop = @textarea.scrollTop
    lastIndexOf = text.lastIndexOf(rhs)
    if text.indexOf(lhs) is 0 and lastIndexOf is (text.length-rhs.length)
      # already wrapped, remove existing wrapping
      str = text.substring(lhs.length, text.length - rhs.length)
      @text(str, keepSelection)
    else
      [s, e] = @_getCaret()
      @_replace(lhs + text + rhs, s, e)
      e = s + lhs.length + text.length + rhs.length
      s = e if not keepSelection
      @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Insert text before the line

  @param [String] text a text used to insert
  @param [Boolean] keepSelection select inserted text if it is `true`
  @return [Selection] return the instance
  ###
  insertBeforeLine: (text, keepSelection) ->
    [s, e] = @lineCaret()
    str = @lineText()
    # set text
    scrollTop = @textarea.scrollTop
    # replace
    @_replace(text+str, s, e)
    # move caret
    e = s + text.length
    s = e if not keepSelection
    @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Insert text after the line

  @param [String] text a text used to insert
  @param [Boolean] keepSelection select inserted text if it is `true`
  @return [Selection] return the instance
  ###
  insertAfterLine: (text, keepSelection) ->
    [s, e] = @lineCaret()
    str = @lineText()
    # set text
    scrollTop = @textarea.scrollTop
    # replace
    @_replace(str+text, s, e)
    # move caret
    s = e
    e = e + text.length
    s = e if not keepSelection
    @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

  ###
  Enclose the line or Open the enclosed line

  @param [String] lhs a text used to insert before the selection
  @param [String] rhs a text used to insert after the selection
  @param [Boolean] keepSelection select inserted text if it is `true`
  @return [Selection] return the instance
  ###
  encloseLine: (lhs, rhs, keepSelection) ->
    text = @lineText()
    scrollTop = @textarea.scrollTop
    lastIndexOf = text.lastIndexOf(rhs)
    if text.indexOf(lhs) is 0 and lastIndexOf is (text.length-rhs.length)
      # already wrapped, remove existing wrapping
      str = text.substring(lhs.length, text.length - rhs.length)
      @text(str, keepSelection)
    else
      [s, e] = @lineCaret()
      @_replace(lhs + text + rhs, s, e)
      e = s + lhs.length + text.length + rhs.length
      s = e if not keepSelection
      @_setCaret(s, e)
    @textarea.scrollTop = scrollTop
    return @

namespace 'Femto.utils', (exports) ->
  exports.W3CSelection = W3CSelection
  exports.Selection = W3CSelection
