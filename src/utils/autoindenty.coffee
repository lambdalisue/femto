#<< utils/selection
#<< utils/selection.ie
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
class AutoIndenty
  ###
  Constructor

  @param [jQuery] textarea A jQuery instance of target textarea DOM element
  @param [bool] expandTab When true, use SPACE insted of TAB for indent
  @param [integer] indentLevel An indent level. Enable only when expandTab is `true`
  ###
  constructor: (@textarea, @expandTab=true, @indentLevel=4) ->
    if @textarea not instanceof jQuery
      @textarea = jQuery(@textarea)
    if @textarea._selection?
      @_selection = @textarea._selection
    else
      @_selection = new Femto.utils.Selection(@textarea.get(0))
      @textarea._selection = @_selection
    if @expandTab
      tabString = Femto.utils.Indenty._makeTabString(@indentLevel)
    else
      tabString = "\t"
    @_pattern = new RegExp "^(?:#{tabString})*"

  ###
  Insert newline after the current caret position
  with appropriate indent characters (keep previous indent level)

  @return [AutoIndenty] the instance
  ###
  insertNewLine: ->
    [cs] = @_selection.caret()
    # get current indent level with regexp
    text = @_selection._getWholeText()
    line = @_selection.lineText().split("\n")[0]
    indent = line.match(@_pattern)
    # move caret forward if the caret stands just before the newline
    if cs is text.length
      # insert newline and indent after to simulate RETURN press
      @_selection.insertAfter "\n#{indent}", false
    else
      if text[cs] is "\n"
        @_selection.caret(1)
      # insert newline and indent before to simulate RETURN press
      @_selection.insertBefore "\n#{indent}", false
      @_selection.caret(indent.length+1)
    return @

  # @private
  _keyDownEvent: (e) =>
    RETURN = 13
    return true if e.which isnt RETURN
    # do not use autoIndent if the ShiftKey is pressed
    return true if e.shiftKey is true
    # insert newline with appropriate indent characters
    @insertNewLine()
    # save memento if available
    @textarea._caretaker?.save()
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

namespace 'Femto.utils', (exports) ->
  exports.AutoIndenty = AutoIndenty
