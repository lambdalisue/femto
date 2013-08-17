# Caret coordinate management class
class Coordinate
  # Construct a new coordinate instance
  # 
  # @param [Object] textarea a textarea DOM instance
  constructor: (@textarea) ->
    @dummy = document.createElement('div')
    # Note:
    #   Internet Explore does not have `getComputedStyle` so you
    #   need to use `@textarea.currentStyle` instead for using it
    #   with Internet Explorer
    @style = document.defaultView.getComputedStyle(@textarea, '')
    # overwrite styles related to font size
    @dummy.style.font = @style.font
    @dummy.style.lineHeight = @style.lineHeight
    @dummy.style.textIndent = @style.textIndent
    @dummy.style.textAlign = @style.textAlign
    @dummy.style.textDecoration = @style.textDecoration
    @dummy.style.textShadow = @style.textShadow
    @dummy.style.letterSpacing = @style.letterSpacing
    @dummy.style.wordSpacing = @style.wordSpacing
    @dummy.style.textTransform = @style.textTransform
    @dummy.style.whiteSpace = @style.whiteSpace
    @dummy.style.width = @style.width
    @dummy.style.height = @style.height
    # overwrite styles
    @dummy.style.visibility = 'hidden'
    @dummy.style.position = 'absolute'
    @dummy.style.top = 0
    @dummy.style.left = 0
    @dummy.style.overflow = 'auto'
    # add to document body
    document.body.appendChild(@dummy)
    # scrollTop change drastically so store previous value
    # to keep code fast
    @_previousLength = 0
    @_previousHeight = 0

  # Escape HTML
  #
  # @private
  # @param [String] s a string to be escaped
  # @return [String] HTML escaped string
  _escapeHTML: (s) ->
    pre = document.createElement('pre')
    # Note:
    #   To use this in Internet Explorer, `pre.innerText` should be used
    #   instead of `pre.textContent`
    pre.textContent = s
    return pre.innerHTML

  # Get coordinate of an element
  #
  # @private
  # @param [Object] elem a target element
  # @return [Object] a coordinate object which has `left`, `right`,
  #   `top`, and `bottom`
  _coordinate: (elem) ->
    # Note:
    #   To use this in Internet Explorer
    #   `document.documentElement.scrollLeft/scrollTop` should be used
    #   and there is '2px Bug' so should extract
    #   `document.documentElement.clientTop/clientLeft` as well.
    #   See the example code below
    #
    #     html = document.documentElement
    #     offsetX = html.scrollLeft - html.clientLeft
    #     offsetY = html.scrollTop - html.clientTop
    body = document.body
    offsetX = body.scrollLeft
    offsetY = body.scrollTop
    # getBoundingClientRect return the relative coordinate from the view
    # so adjust scroll amount to make it absolute coordinate.
    # And also, the function return float value so Math.round is required
    rect = elem.getBoundingClientRect()
    # Note
    #   'Bitwise' is similar to `parseInt` but much faster
    #   http://jsperf.com/math-floor-vs-math-round-vs-parseint/33
    rect =
      left: (rect.left + offsetX) >> 0
      right: (rect.right + offsetX) >> 0
      top: (rect.top + offsetY) >> 0
      bottom: (rect.bottom + offsetY) >> 0
    return rect

  # Get coordinate of selection
  #
  # @param [Integer] s a start index of selection
  # @param [Integer] e an end index of selection
  # @return [Object] a coordinate object which has `left`, `right`,
  #   `top`, and `bottom`
  coordinate: (s, e) ->
    processText = (text) =>
      return @_escapeHTML(text).replace(/\n/g, '<br>')
    wholeText = @textarea.value
    lhs = wholeText.substring(0, e)
    # create cursor span element with unique id.
    # Date.now return milliseconds, it is unique enough for this usage
    # cursor span must contain at least one letter so I added '@'
    uniqid = Date.now().toString()
    uniqid = "coordinate-cursor-#{uniqid}"
    cursor = "<span id='#{uniqid}'>*</span>"
    # update inner html of dummy div
    if @_previousLength < lhs.length
      # use previous value to increase calculation speed
      offset = @_previousLength
    else
      # reset calculation
      offset = 0
      @_previousLength = 0
      @_previousHeight = 0
    @dummy.innerHTML = processText(lhs.substring(offset)) + cursor
    # get coordinate by cursor span
    cursor = document.getElementById(uniqid)
    cursor = @_coordinate(cursor)
    cursor =
      left: cursor.left + @styleOffsetX
      right: cursor.right + @styleOffsetX
      top: cursor.top + @_previousHeight
      bottom: cursor.bottom + @_previousHeight
    @_previousLength = lhs.length
    @_previousHeight = cursor.top
    return cursor


# A textarea caret (selection) management class
#
# This management class only support W3C selection
#
class Caret
  # Construct a new caret of `textarea`
  #
  # @param [Object] textarea a textarea DOM element
  # @param [Boolean] supportCoordinate if `true` then `coordinate()` method
  #   will be able to use with the instance (Default: false)
  # @example
  #   textarea = document.getElementsByTagName('textarea')[0]
  #   caret = new Caret(textarea)
  constructor: (@textarea, supportCoordinate) ->
    if supportCoordinate is true
      @_coordinate = new Coordinate(@textarea)

  # Replace a text within a range (s to e)
  #
  # @private
  # @param [String] text an original whole text
  # @param [String] repl a text used for replacing the range
  # @param [Integer] s a start position of the range
  # @param [Integer] e a end position of the range
  # @return [String] a replaced (modified) text
  _replace: (text, repl, s, e) ->
    lhs = text.substring(0, s)
    rhs = text.substring(e)
    return lhs + repl + rhs

  # Get start and end positions of a caret
  #
  # @return [Array<Integer>] an array which first and second items are start
  #   and end positions of a current caret respectively.
  # @example
  #   # get current caret position
  #   caret.get() # -> [0, 0]
  #   # change selection range to [1, 2]
  #   textarea.setSelectionRange(1, 2)
  #   # get current caret position
  #   caret.get() # -> [1, 2]
  get: ->
    s = @textarea.selectionStart
    e = @textarea.selectionEnd
    return [s, e]

  # Set start and end positions of a caret
  #
  # @overload set(s, e)
  #   Set start and end position of caret to arguments `s` and `e` respectively.
  #   @param [Integer] s a start position of a caret
  #   @param [Integer] e a end position of a caret
  #   @return [Caret] an instance of Caret
  #
  # @overload set(offset)
  #   Move caret position forward `offset` characters
  #   @param [Integer] offset the number of characters move
  #   @return [Caret] an instance of Caret
  #
  # @example
  #   caret.get() # -> [0, 0]
  #   # change caret position to [1, 5]
  #   caret.set(1, 5)
  #   caret.get() # -> [1, 5]
  #   # move caret forward 5 characters
  #   caret.set(5)
  #   caret.get() # -> [6, 10]
  set: (s, e) ->
    if not e?
      offset = s
      [s, e] = @get()
      s += offset
      e += offset
    @textarea.setSelectionRange(s, e)
    return @

  # Return whether a caret indicate a range (selection) or not
  #
  # @return [Boolean] true when a caret indicate a range
  # @example
  #   caret.get() # -> [0, 0]
  #   caret.isCollapsed() # -> true
  #   caret.set(1, 3)
  #   caret.isCollapsed() # -> false
  isCollapsed: ->
    [s, e] = @get()
    return s is e

  # Move a start position of a caret to its end position or vice versa
  #
  # @param [Boolean] toStart if it is `true` then the end position of the caret
  #   will move to its start position
  # @return [Caret] an instance of Caret
  # @example
  #   caret.set(2, 5)
  #   caret.collapse()
  #   caret.get() # -> [5, 5]
  #   caret.set(2, 5)
  #   caret.collapse(true)
  #   caret.get() # -> [2, 2]
  collapse: (toStart) ->
    [s, e] = @get()
    if toStart is true
      @set(s, s)
    else
      @set(e, e)

  # Get or replace a selected text
  #
  # @overload text()
  #   Return a selected text
  #   @return [String] a selected text
  #
  # @overload text(text, keepSelection)
  #   Replace a selected text with `text`
  #   @param [String] text a text used for replacing the selected text
  #   @param [Boolean] keepSelection if it is `true` then a caret will
  #     select the modified region, otherwise a caret move to the end
  #     of the modified text
  #   @return [Caret] an instance of Caret
  #
  # @example
  #   textarea.value = "foobar"
  #   caret.text() # -> ""
  #   caret.set(1, 5)
  #   caret.text() # -> "ooba"
  #   caret.text('hogehoge')
  #   textarea.value # -> "fhogehoger"
  #   caret.text() # -> ""
  #   textarea.value = "foobar"
  #   caret.set(1, 5)
  #   caret.text('hogehoge', true)
  #   textarea.value # -> "fhogehoger"
  #   caret.text() # -> "hogehoge"
  text: (text, keepSelection) ->
    [s, e] = @get()
    # Note:
    #
    # Normalization (\r\n -> \n) is required at this step if you want to use
    # this libary for Internet Explorer or any browser which use \r\n instead
    # of \n for newline
    #
    # wholeText = @textarea.value.replace(/\r\n/, '\n')
    wholeText = @textarea.value
    if not text?
      # Get a selected text
      return wholeText.substring(s, e)
    else
      # Replace a selected text
      scrollTop = @textarea.scrollTop
      wholeText = @_replace(wholeText, text, s, e)
      @textarea.value = wholeText
      # move caret
      e = s + text.length
      s = e if not keepSelection
      @set(s, e)
      @textarea.scrollTop = scrollTop
    return @

  # Insert a text before a caret
  #
  # @param [String] text a text will be inserted
  # @param [Boolean] keepSelection if it is `true` then a caret will select the
  #   modified region, otherwise a caret move to the end of the modified text
  # @return [Caret] an instance of Caret
  # @example
  #   textarea.value = "aaaa"
  #   caret.set(1, 3)
  #   caret.insertBefore("AAA")
  #   textarea.value # -> "aAAAaaa"
  #   caret.text() # -> ""
  #   textarea.value = "aaaa"
  #   caret.set(1, 3)
  #   caret.insertBefore("AAA", true)
  #   textarea.value # -> "aAAAaaa"
  #   caret.text() # -> "AAA"
  insertBefore: (text, keepSelection) ->
    [s, e] = @get()
    # Note:
    #
    # Normalization (\r\n -> \n) is required at this step if you want to use
    # this libary for Internet Explorer or any browser which use \r\n instead
    # of \n for newline
    #
    # wholeText = @textarea.value.replace(/\r\n/, '\n')
    scrollTop = @textarea.scrollTop
    wholeText = @textarea.value
    selection = wholeText.substring(s, e)
    wholeText = @_replace(wholeText, text+selection, s, e)
    @textarea.value = wholeText
    # move caret
    e = s + text.length
    s = e if not keepSelection
    @set(s, e)
    @textarea.scrollTop = scrollTop
    return @

  # Insert a text after a caret
  #
  # @param [String] text a text will be inserted
  # @param [Boolean] keepSelection if it is `true` then a caret will select the
  #   modified region, otherwise a caret move to the end of the modified text
  # @return [Caret] an instance of Caret
  # @example
  #   textarea.value = "aaaa"
  #   caret.set(1, 3)
  #   caret.insertAfter("AAA")
  #   textarea.value # -> "aaaAAAa"
  #   caret.text() # -> ""
  #   textarea.value = "aaaa"
  #   caret.set(1, 3)
  #   caret.insertAfter("AAA", true)
  #   textarea.value # -> "aaaAAAa"
  #   caret.text() # -> "AAA"
  insertAfter: (text, keepSelection) ->
    [s, e] = @get()
    # Note:
    #
    # Normalization (\r\n -> \n) is required at this step if you want to use
    # this libary for Internet Explorer or any browser which use \r\n instead
    # of \n for newline
    #
    # wholeText = @textarea.value.replace(/\r\n/, '\n')
    scrollTop = @textarea.scrollTop
    wholeText = @textarea.value
    selection = wholeText.substring(s, e)
    wholeText = @_replace(wholeText, selection+text, s, e)
    @textarea.value = wholeText
    # move caret
    s = e
    e = e + text.length
    s = e if not keepSelection
    @set(s, e)
    @textarea.scrollTop = scrollTop
    return @

  # Enclose a selected text or remove the head and tail of enclosed text
  #
  # @param [String] lhs a head text used to enclose
  # @param [String] rhs a tail text used to enclose
  # @param [Boolean] keepSelection if it is `true` then a caret will select the
  #   modified region, otherwise a caret move to the end of the modified text
  # @return [Caret] an instance of Caret
  # @example
  #   textarea.value = "aaaa"
  #   caret.set(1, 3)
  #   caret.enclose("AAA", "BBB")
  #   textarea.value # -> "aAAAaaBBBa"
  #   caret.text() # -> ""
  #   textarea.value = "aaaa"
  #   caret.set(1, 3)
  #   caret.enclose("AAA", "BBB", true)
  #   textarea.value # -> "aAAAaaBBBa"
  #   caret.text() # -> "AAAaaBBB"
  #   caret.enclose("AAA", "BBB", true)
  #   textarea.value # -> "aaaa"
  #   caret.text() # -> "aa"
  enclose: (lhs, rhs, keepSelection) ->
    # @private
    startsWith = (str, prefix) ->
      str.lastIndexOf(prefix, 0) is 0
    # @private
    endsWith = (str, suffix) ->
      sub = str.length - suffix.length
      return sub >= 0 and str.indexOf(suffix, sub) isnt -1
    # Note:
    #
    # Normalization (\r\n -> \n) is required at this step if you want to use
    # this libary for Internet Explorer or any browser which use \r\n instead
    # of \n for newline
    #
    # wholeText = @textarea.value.replace(/\r\n/, '\n')
    scrollTop = @textarea.scrollTop
    wholeText = @textarea.value
    selection = @text()
    if startsWith(selection, lhs) and endsWith(selection, rhs)
      # selection is already enclosed. remove the head and tail
      selection = selection.substring(
        lhs.length, selection.length - rhs.length)
      @text(selection, keepSelection)
    else
      [s, e] = @get()
      selection = lhs + selection + rhs
      wholeText = @_replace(wholeText, selection, s, e)
      @textarea.value = wholeText
      # move caret
      e = s + selection.length
      s = e if not keepSelection
      @set(s, e)
    @textarea.scrollTop = scrollTop
    return @

  # Get coordinate of a current selection
  #
  # @return [Object] a coordinate object which has `left`, `right`,
  #   `top`, and `bottom`
  coordinate: ->
    if not @_coordinate?
      throw new Error("Caret instance should be construct with " + \
                      "second argument `true` to use coordinate method")
    return @_coordinate.coordinate.apply(@_coordinate, @get())


namespace 'Femto.utils', (exports) ->
  exports.Caret = Caret
