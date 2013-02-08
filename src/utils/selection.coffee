###
Cross-browser textarea selection module

@author lambdalisue
@since 2013
###
"use strict"

utils.Selection = class utils.W3CSelection
  ###
  Closs-browser textarea selection
  ###
  constructor: (@textarea) ->
    ### Selection constructor ###

  _getCaret: ->
    s = @textarea.selectionStart
    e = @textarea.selectionEnd
    return [s, e]
  _setCaret: (s, e) ->
    @textarea.setSelectionRange(s, e)
    return @

  _getWholeText: ->
    return @textarea.value
  _setWholeText: (value) ->
    @textarea.value = value
    return @

  _replace: (repl, s, e) ->
    v = @_getWholeText()
    b = v.substring 0, s
    a = v.substring e
    @_setWholeText(b + repl + a)

  ###
  Get or set caret

  @param [s] start index of the caret

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
