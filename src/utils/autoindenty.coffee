#<< utils/selection
#<< utils/selection.ie
"use strict"
###
Cross-browser textarea auto indent manager

@example
  textarea = document.createElement('textarea')
  textarea.autoIndenty = new AutoIndenty(jQuery(textarea))
  # insert newline after current caret with appropriate indent characters
  textarea.autoIndenty.insertNewLine
  # enable auto indent
  textarea.autoIndenty.enable()
  # disable auto indent
  textarea.autoIndenty.disable()
###
class utils.AutoIndenty
  ###
  Constructor

  @param [jQuery] textarea A target textarea DOM element
  @param [String] tabString a tab string used to insert (default: '    ')
  ###
  constructor: (@textarea, @tabString='    ') ->
    if @textarea not instanceof jQuery
      @textarea = jQuery(@textarea)
    if @textarea._selection?
      @_selection = @textarea._selection
    else
      @_selection = new utils.Selection(@textarea.get(0))
      @textarea._selection = @_selection

  ###
  Insert newline after the current caret position
  with appropriate indent characters (keep previous indent level)

  @return [AutoIndenty] the instance
  ###
  insertNewLine: ->
    [cs] = @_selection.caret()
    pattern = new RegExp "^(?:#{@tabString})*"
    # get current indent level with regexp
    line = @_selection.lineText().split("\n")[0]
    indent = line.match(pattern)
    # move caret forward if the caret stands just before the newline
    if @_selection._getWholeText().substring(cs, cs+1) is "\n"
      @_selection.caret(1)
    # insert newline and indent after to simulate RETURN press
    @_selection.insertAfter "\n#{indent}", false
    return @

  # @private
  _keyDownEvent: (e) =>
    RETURN = 13
    return if e.which isnt RETURN
    # do not use autoIndent if the ShiftKey is pressed
    return if e.shiftKey
    # insert newline with appropriate indent characters
    @insertNewLine()
    # cancel bubbling
    e.stopPropagation()
    e.stopImmediatePropagation()
    # stop default
    e.preventDefault()
    return false

  ###
  Enable auto indent feature on target textarea

  @return [AutoIndenty] the instance
  ###
  enable: ->
    @textarea.on 'keydown', (e) => @_keyDownEvent(e)

  ###
  Disable auto indent feature on target textarea

  @return [AutoIndenty] the instance
  ###
  disable: ->
    @textarea.off 'keydown', (e) => @_keyDownEvent(e)
