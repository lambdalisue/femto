#<< utils/selection
if document.selection?
  # http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
  occurrences = (str, subStr, allowOverlapping) ->
    str += ""
    subStr += ""
    if subStr.length <= 0
      return str.length+1
    n = pos = 0
    step = if allowOverlapping then 1 else subStr.length
    while true
      pos = str.indexOf(subStr, pos)
      if pos >= 0
        n++
        pos += step
      else
        break
    return n
  utils.Selection = class utils.IESelection extends utils.W3CSelection
    constructor: (@textarea) ->
      @_document = @textarea.ownerDocument

    _getWholeText: ->
      value = @textarea.value
      value = value.replace(/\r\n/g, "\n")
      return value

    _getCaret: ->
      range = @_document.selection.createRange()
      clone = range.duplicate()
      clone.moveToElementText(@textarea)
      clone.setEndPoint('EndToEnd', range)
      s = clone.text.length - range.text.length
      e = s + range.text.length
      e -= occurrences(range.text, "\r\n")
      return [s, e]

    _setCaret: (s, e) ->
      range = @textarea.createTextRange()
      range.collapse(true)
      range.moveStart('character', s)
      range.moveEnd('character', e - s)
      range.select()
      return @
