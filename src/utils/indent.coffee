#<< utils/extend
#<< utils/caret
#<< utils/linecaret

# A textarea indent management class
class Indent
  # Construct a new indent instance
  #
  # @param [Object] textarea a textarea DOM element
  # @option options [Boolean] expandTab use continuous spaces instead of tab
  #   (Default: `true`)
  # @option options [Integer] indentLevel the number of spaces. it is enable
  #   only when `expandTab` is true (Default: `4`)
  # @example
  #   textarea = document.getElementByTagName('textarea')[0]
  #   indent = new Indent(textarea)
  constructor: (@textarea, options) ->
    @options = Femto.utils.extend(options,
      'expandTab': true
      'indentLevel': 4
    )
    # create regex patterns
    @_newlinep = new RegExp("^(?:#{@_makeTabString(@options.indentLevel)})*")
    @_leadingp = new RegExp("^\\s*")
    # create caret and linecaret instance
    @caret = new Femto.utils.Caret(@textarea, true)
    @linecaret = new Femto.utils.LineCaret(@textarea)
    # scrollTop regulation Y
    style = document.defaultView.getComputedStyle(@textarea)
    @offsetY = parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth)
    @offsetY = @offsetY >> 0


  # Create tabString of each levels
  #
  # @private
  # @param [Integer] level the number of space used for a single indent
  # @return [String] tabString
  _makeTabString: (level) ->
    if @options.expandTab
      name = "_tabString#{level}Cache"
      if not @[name]?
        @[name] = new Array(level+1).join(" ")
      return @[name]
    else
      return "\t"

  # Get the number of leading spaces
  #
  # @private
  # @param [String] line a line
  # @return [Integer] the number of leading spaces
  _leadingSpaces: (line) ->
    return line.match(@_leadingp)[0].length

  # Insert tabString at a current caret position or a start position of each
  # selected lines
  # @return [Indent] an instance of Indent
  indent: ->
    selection = @caret.text()
    [s, e] = @caret.get()
    [ls, le] = @linecaret.get()
    # different approach is required for multiline and singleline
    if not @caret.isCollapsed() and selection.indexOf("\n") isnt -1
      # multiline mode
      indentLine = (line) =>
        if @options.expandTab
          # get the number of leading spaces
          leadingSpaces = @_leadingSpaces(line)
          # calculate the number of the protruded spaces
          protrudedSpaces = leadingSpaces % @options.indentLevel
          # create a tabString with an appropriate the numer of spaces
          tabString = @_makeTabString(@options.indentLevel - protrudedSpaces)
        else
          tabString = @_makeTabString()
        # add a leading tabString
        return tabString + line
      lines = @linecaret.text().split("\n")
      modified = (indentLine(l) for l in lines)
      @linecaret.text(modified.join("\n"), false)
      # regulate caret positions
      offsets = modified[0].length - lines[0].length
      offsete = modified.join("").length - lines.join("").length
      if ls isnt s
        # include tabString if the caret starts from the first character
        # of the line
        s += offsets
      @caret.set(s, e+offsete)
    else
      # singleline mode
      if @options.expandTab
        # get the relative start position of the caret in the line
        rels = s - ls
        # calculate the number of the protruded spaces
        protrudedSpaces = rels % @options.indentLevel
        # create a tabString with an appropriate the number of spaces
        tabString = @_makeTabString(@options.indentLevel - protrudedSpaces)
      else
        tabString = @_makeTabString()
      offset = tabString.length
      @caret.text(tabString + selection, false)
      # regulate caret positions
      @caret.set(s + offset, e + offset)
    return @

  # Remove tabString at the current caret position of the left hand of the
  # selection. It will do nothing when no tabString is found on left hand
  # @return [Indent] an instance of Indent
  outdent: ->
    selection = @caret.text()
    [s, e] = @caret.get()
    [ls, le] = @linecaret.get()
    # different approach is required for multiline and singleline
    if not @caret.isCollapsed() and selection.indexOf("\n") isnt -1
      # multiline mode
      outdentLine = (line) =>
        if @options.expandTab
          # get the number of leading spaces
          leadingSpaces = @_leadingSpaces(line)
          # calculate the number of the protruded spaces
          protrudedSpaces = leadingSpaces % @options.indentLevel
          # create a tabString with an appropriate the numer of spaces
          tabString = @_makeTabString(@options.indentLevel - protrudedSpaces)
        else
          tabString = @_makeTabString()
        # remove a leading tabString
        return line.replace(new RegExp("^#{tabString}"), "")
      lines = @linecaret.text().split("\n")
      modified = (outdentLine(l) for l in lines)
      @linecaret.text(modified.join("\n"), false)
      # regulate caret positions
      offsets = modified[0].length - lines[0].length
      offsete = modified.join("").length - lines.join("").length
      if ls isnt s
        # include tabString if the caret starts from the first character
        # of the line (note sign of value is negative so use 'add')
        s += offsets
      @caret.set(s, e+offsete)
    else
      # singleline mode
      if @options.expandTab
        # get the number of leading spaces
        leadingSpaces = @_leadingSpaces(selection)
        # get the relative start position of the caret in the line
        rels = s - ls + leadingSpaces
        # calculate the number of the protruded spaces
        protrudedSpaces = rels % @options.indentLevel
        # create a tabString with an appropriate the number of spaces
        tabString = @_makeTabString(@options.indentLevel - protrudedSpaces)
      else
        tabString = @_makeTabString()
      selection = @linecaret.text()
      index = selection.lastIndexOf(tabString, s-ls)
      # do nothing if no tabString is found
      return @ if index is -1
      # remove tabString from the line
      offset = tabString.length
      lhs = selection.substring(0, index)
      rhs = selection.substring(index+offset)
      @linecaret.text(lhs+rhs, false)
      # regulate caret positions
      @caret.set(s-offset, e-offset)
    return @

  # Insert newline after the curret caret position with appropriate indent
  # characters to keep previous indent level
  # @return [Indent] an instance of Indent
  insertNewLine: ->
    [s, e] = @caret.get()
    # Note:
    #
    # Normalization (\r\n -> \n) is required at this step if you want to use
    # this libary for Internet Explorer or any browser which use \r\n instead
    # of \n for newline
    #
    # wholeText = @textarea.value.replace(/\r\n/, '\n')
    wholeText = @textarea.value
    # find a start position of the last line before the caret
    ls = wholeText.lastIndexOf('\n', e-1) + 1
    # get the indent string used in the last line
    indent = wholeText.substring(ls, e).match(@_newlinep)
    # insert newline with the indent
    insert = "\n#{indent}"
    @caret.insertAfter insert, false
    # move the caret
    if s == e
      @caret.set(s+insert.length, s+insert.length)
    else
      @caret.set(s, e+insert.length)
    return @

  # KeyDown Event
  #
  # this method is called when user hit any key
  # @private
  # @param [Object] e a DOM event object
  # @return [Booelean] `false` when the event was proceed
  _keyDownEvent: (e) =>
    # TAB = 9, Return = 13
    return true if e.which isnt 9 and e.which isnt 13
    if e.which is 9
      if e.shiftKey
        @outdent()
      else
        @indent()
    else if e.which is 13
      # do not keep indent level when user press shift and return together
      return true if e.shiftKey
      # insert newline with appropriate indent characters
      @insertNewLine()
      caretY = @caret.coordinate().bottom
      offset = caretY - @textarea.scrollTop - @textarea.clientHeight
      if offset > 0
        @textarea.scrollTop += offset + @offsetY
    # cancel bubbling immediately
    #e.stopImmediatePropagation()
    # cancel bubbling and default behavior
    e.stopPropagation()
    e.preventDefault()
    return false

  # Enable indent feature
  # @return [Indent] an instance of Indent
  enable: ->
    @textarea.addEventListner('keydown', @_keyDownEvent, false)
    return @

  # Disable indent feature
  # @return [Indent] an instance of Indent
  disable: ->
    @textarea.removeEventListner('keydown', @_keyDownEvent, false)
    return @

namespace 'Femto.utils', (exports) ->
  exports.Indent = Indent
