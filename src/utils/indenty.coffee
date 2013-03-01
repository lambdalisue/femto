#<< utils/selection
#<< utils/selection.ie
###
Cross-browser textarea indent manager

@example
  textarea = document.createElement('textarea')
  textarea.indenty = new Indenty(jQuery(textarea))
  # indent at current caret position
  textarea.indenty.indent()
  # outdent at current caret position
  textarea.indenty.outdent()
  # enable TAB key indent
  textarea.indenty.enable()
  # disable TAB key indent
  textarea.indenty.disable()
###
class Indenty
  """use strict"""
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
      @_selection = new Femto.utils.Selection(@textarea.get(0))
      @textarea._selection = @_selection

  ###
  Insert tabString at the current caret position
  or start point of the selection

  @return [Indenty] the instance
  ###
  indent: ->
    selected = @_selection.text()
    if "\n" in selected
      # multiline mode
      selected = @_selection.lineText()
      modified = (@tabString + l for l in selected.split("\n"))
      @_selection.lineText(modified.join("\n"), true)
    else
      # singleline mode
      keepSelection = not @_selection.isCollapsed()
      @_selection.text(@tabString+selected, keepSelection)
    return @

  ###
  Remove tabString at the current caret position
  or the left hand of the selection

  It will not do anything if no tabString is found

  @return [Indenty] the instance
  ###
  outdent: ->
    pattern = new RegExp("^#{@tabString}")
    selected = @_selection.text()
    if "\n" in selected
      # multiline mode
      selected = @_selection.lineText()
      modified = (l.replace(pattern, "") for l in selected.split("\n"))
      @_selection.lineText(modified.join("\n"), true)
    else
      [cs] = @_selection.caret()
      [ls] = @_selection.lineCaret()
      line = @_selection.lineText()
      index = line.lastIndexOf(@tabString, cs-ls)
      # do nothing if no tabString is found
      return @ if index is -1
      # remove tabString from the line
      b = line.substring 0, index
      a = line.substring index+@tabString.length
      # replace the line
      @_selection.lineText(b+a, false)
      # move caret to the removed point
      @_selection.caret(ls+index, ls+index)
    return @

  # @private
  _keyDownEvent: (e) =>
    # TAB = 9
    return if e.which isnt 9
    if e.shiftKey
      @outdent()
    else
      @indent()
    # cancel bubbling
    e.stopPropagation()
    e.stopImmediatePropagation()
    # stop default
    e.preventDefault()
    return false

  ###
  Enable TAB key indent feature on target textarea

  @return [Indenty] the instance
  ###
  enable: ->
    @textarea.on 'keydown', @_keyDownEvent
    return @

  ###
  Disable TAB key indent feature on target textarea

  @return [Indenty] the instance
  ###
  disable: ->
    @textarea.off 'keydown', @_keyDownEvent
    return @

namespace 'Femto.utils', (exports) ->
  exports.Indenty = Indenty
