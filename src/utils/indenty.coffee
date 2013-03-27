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
  ###
  Constructor

  @param [jQuery] textarea A target textarea DOM element
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

  ###
  Insert tabString at the current caret position
  or start point of the selection

  @return [Indenty] the instance
  ###
  indent: ->
    collapsed = @_selection.isCollapsed()
    selected = @_selection.text()
    [cs, ce] = @_selection.caret()
    [ls, le] = @_selection.lineCaret()
    if not collapsed and selected.indexOf("\n") isnt -1
      # multiline mode
      indentSingleLine = (lineText) =>
        if @expandTab
          leadingSpaces = lineText.length - lineText.replace(/^\s*/, '').length
          diff = leadingSpaces % @indentLevel
          tabString = makeTabString(@indentLevel - diff)
        else
          tabString = "\t"
        return tabString + lineText
      selected = @_selection.lineText().split("\n")
      modified = (indentSingleLine(l) for l in selected)
      @_selection.lineText(modified.join("\n"), false)
      # regulate the selection
      offset_s = modified[0].length - selected[0].length
      offset_e = modified.join("").length - selected.join("").length
      if ls isnt cs
        # include tabString if the selection starts from the start character
        # of the line
        cs += offset_s
      @_selection.caret(cs, ce + offset_e)
    else
      # singleline mode
      if @expandTab
        # get current indent level
        rels = cs - ls
        diff = rels % @indentLevel
        tabString = makeTabString(@indentLevel - diff)
      else
        tabString = "\t"
      tabLength = tabString.length
      @_selection.text(tabString+selected, false)
      # regulate the selection
      @_selection.caret(cs + tabLength, ce + tabLength)
    return @

  ###
  Remove tabString at the current caret position
  or the left hand of the selection

  It will not do anything if no tabString is found

  @return [Indenty] the instance
  ###
  outdent: ->
    collapsed = @_selection.isCollapsed()
    selected = @_selection.text()
    lineText = @_selection.lineText()
    [cs, ce] = @_selection.caret()
    [ls, le] = @_selection.lineCaret()
    if not collapsed and selected.indexOf("\n") isnt -1
      # multiline mode
      outdentSingleLine = (lineText) =>
        if @expandTab
          leadingSpaces = lineText.length - lineText.replace(/^\s*/, '').length
          diff = leadingSpaces % @indentLevel
          tabString = makeTabString(@indentLevel - diff)
        else
          tabString = "\t"
        return lineText.replace(new RegExp("^#{tabString}"), "")
      selected = @_selection.lineText().split("\n")
      modified = (outdentSingleLine(l) for l in selected)
      @_selection.lineText(modified.join("\n"), false)
      # regulate the selection
      offset_s = selected[0].length - modified[0].length
      offset_e = selected.join("").length - modified.join("").length
      if ls isnt cs
        # include tabString if the selection starts from the start character
        # of the line
        cs -= offset_s
      @_selection.caret(cs, ce - offset_e)
    else
      if @expandTab
        # get the number of leading spaces in selection
        leadingSpaces = selected.length - selected.replace(/^\s*/, '').length
        # get current indent level (use the number of leading spaces as offset)
        rels = cs - ls + leadingSpaces
        diff = rels % @indentLevel
        tabString = makeTabString(@indentLevel - diff)
      else
        tabString = "\t"
      tabLength = tabString.length
      index = lineText.lastIndexOf(tabString, cs-ls)
      # do nothing if no tabString is found
      return @ if index is -1
      # remove tabString from the line
      b = lineText.substring 0, index
      a = lineText.substring index+tabString.length
      # replace the line
      @_selection.lineText(b+a, false)
      # move caret to the removed point
      @_selection.caret(cs-tabLength, ce-tabLength)
    return @

  # @private
  _keyDownEvent: (e) =>
    # TAB = 9
    return if e.which isnt 9
    if e.shiftKey
      @outdent()
    else
      @indent()
    # save memento if available
    @textarea._caretaker?.save()
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
Indenty._makeTabString = makeTabString = (level) ->
  cache = "#{level}Cache"
  if not makeTabString[cache]?
    makeTabString[cache] = new Array(level + 1).join(" ")
  return makeTabString[cache]

namespace 'Femto.utils', (exports) ->
  exports.Indenty = Indenty
