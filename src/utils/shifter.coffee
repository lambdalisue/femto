#<< utils/selection
#<< utils/selection.ie

###
Create continuous spaces
###
makeTabString = (level) ->
  cache = "#{level}Cache"
  if not makeTabString[cache]?
    makeTabString[cache] = new Array(level + 1).join(" ")
  return makeTabString[cache]


###
A text indent management class

###
class Shifter
  ###
  Constructor

  @param [Object] textarea a textarea jQuery instance or DOM element
  @param [Object] selection a instance of Selection of the textarea
  @param [Boolean] expandTab if true, use space instead of tab for indent
  @param [Integer] indentLevel an indent level. enable only when expandTab is `true`
  ###
  constructor: (@textarea, @selection, @expandTab=true, @indentLevel=4) ->
    if @textarea not instanceof jQuery
      @textarea = jQuery(@textarea)
    # create tabstring
    if @expandTab
      tabString = makeTabString(@indentLevel)
    else
      tabString = "\t"
    @_pattern = new RegExp "^(?:#{tabString})*"

  ###
  Insert tabString at the current caret position
  or start point of the selection

  @return [Object] the instance
  ###
  indent: ->
    collapsed = @selection.isCollapsed()
    selected = @selection.text()
    [cs, ce] = @selection.caret()
    [ls, le] = @selection.lineCaret()
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
      selected = @selection.lineText().split("\n")
      modified = (indentSingleLine(l) for l in selected)
      @selection.lineText(modified.join("\n"), false)
      # regulate the selection
      offset_s = modified[0].length - selected[0].length
      offset_e = modified.join("").length - selected.join("").length
      if ls isnt cs
        # include tabString if the selection starts from the start character
        # of the line
        cs += offset_s
      @selection.caret(cs, ce + offset_e)
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
      @selection.text(tabString+selected, false)
      # regulate the selection
      @selection.caret(cs + tabLength, ce + tabLength)
    return @

  ###
  Remove tabString at the current caret position
  or the left hand of the selection

  It will not do anything if no tabString is found

  @return [Object] the instance
  ###
  outdent: ->
    collapsed = @selection.isCollapsed()
    selected = @selection.text()
    lineText = @selection.lineText()
    [cs, ce] = @selection.caret()
    [ls, le] = @selection.lineCaret()
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
      selected = @selection.lineText().split("\n")
      modified = (outdentSingleLine(l) for l in selected)
      @selection.lineText(modified.join("\n"), false)
      # regulate the selection
      offset_s = selected[0].length - modified[0].length
      offset_e = selected.join("").length - modified.join("").length
      if ls isnt cs
        # include tabString if the selection starts from the start character
        # of the line
        cs -= offset_s
      @selection.caret(cs, ce - offset_e)
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
      @selection.lineText(b+a, false)
      # move caret to the removed point
      @selection.caret(cs-tabLength, ce-tabLength)
    return @

  ###
  Insert newline after the current caret position
  with appropriate indent characters (keep previous indent level)

  @return [Object] the instance
  ###
  insertNewLine: ->
    [s, e] = @selection.caret()
    # find the start caret of last line in the selection
    text = @selection._getWholeText()
    ls = text.lastIndexOf('\n', e-1) + 1
    # get the indent string used in the last line
    indent = text[ls...e].match(@_pattern)
    # insert newline with the indent
    insert = "\n#{indent}"
    @selection.insertAfter insert, false
    # move the caret
    if s == e
      @selection.caret(s+insert.length, s+insert.length)
    else
      @selection.caret(s, e+insert.length)
    return @

  # @private
  _keyDownEvent: (e) =>
    # TAB = 9, Return = 13
    return true if e.which isnt 9 and e.which isnt 13
    if e.which is 9
      if e.shiftKey
        @outdent()
      else
        @indent()
    else if e.which is 13
      # do not use autoIndent if the ShiftKey is pressed
      return true if e.shiftKey
      # insert newline with appropriate indent characters
      @insertNewLine()
    # cancel bubbling
    e.stopPropagation()
    e.stopImmediatePropagation()
    # stop default
    e.preventDefault()
    return false

  ###
  Enable TAB key indent feature on target textarea

  @return [Object] the instance
  ###
  enable: ->
    @textarea.on 'keydown', @_keyDownEvent
    return @

  ###
  Disable TAB key indent feature on target textarea

  @return [Object] the instance
  ###
  disable: ->
    @textarea.off 'keydown', @_keyDownEvent
    return @

namespace 'Femto.utils', (exports) ->
  exports.Shifter = Shifter
