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
    [s, e] = @_selection.caret()
    # find the start caret of last line in the selection
    text = @_selection._getWholeText()
    ls = text.lastIndexOf('\n', e-1) + 1
    # get the indent string used in the last line
    indent = text[ls...e].match(@_pattern)
    # insert newline with the indent
    insert = "\n#{indent}"
    @_selection.insertAfter insert, false
    # move the caret
    if s == e
      @_selection.caret(s+insert.length, s+insert.length)
    else
      @_selection.caret(s, e+insert.length)
    return @

  # @private
  _keyDownEvent: (e) =>
    RETURN = 13
    return true if e.which isnt RETURN
    # do not use autoIndent if the ShiftKey is pressed
    return true if e.shiftKey
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
