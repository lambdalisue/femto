#<< utils/selection
if document.selection?
  normalizeText = (rawText) ->
    return rawText.replace(/\r\n/g, '\n')
  ###
  Get regulation offset
  ###
  getRegulationOffset = (normalizedText, caret) ->
    leadingText = normalizedText[0...caret]
    # remove trailing newline to prevent counting it
    leadingText = leadingText.replace(/\n$/,'')
    # count the number of newline and return as an offset
    # 1 is subtracted because of the difference between
    # Caret (Selection) and Index (Character)
    return leadingText.split("\n").length - 1
  ###
  Textarea selection class for IE
  ###
  class IESelection extends Femto.utils.W3CSelection
    constructor: (@textarea) ->
      @_document = @textarea.ownerDocument

    _getWholeText: ->
      return @textarea.value.replace(/\r\n/g, '\n')

    _getCaret: ->
      # See: http://stackoverflow.com/questions/3622818/ies-document-selection-createrange-doesnt-include-leading-or-trailing-blank-li
      s = e = 0
      range = @_document.selection.createRange()
      if range and range.parentElement() is @textarea
        length = @textarea.value.length
        normalizedText = @_getWholeText()
        # create a working TextRange that lives only in the input
        textInputRange = @textarea.createTextRange()
        textInputRange.moveToBookmark(range.getBookmark())
        # check if the start and end of the selection are at the very end
        # of the input, since moveStart/moveEnd doesn't return what we want
        # in those cases
        endRange = @textarea.createTextRange()
        endRange.collapse(false)

        if textInputRange.compareEndPoints("StartToEnd", endRange) > -1
          s = e = length
        else
          s = -textInputRange.moveStart("character", -length)
          s += getRegulationOffset(normalizedText, s)

          if textInputRange.compareEndPoints("EndToEnd", endRange) > -1
            e = length
          else
            e = -textInputRange.moveEnd("character", -length)
            e += getRegulationOffset(normalizedText, e)
      return [s, e]

    _setCaret: (s, e) ->
      normalizedText = @_getWholeText()
      s -= getRegulationOffset(normalizedText, s)
      e -= getRegulationOffset(normalizedText, e)
      range = @textarea.createTextRange()
      range.collapse(true)
      range.moveEnd('character', e)
      range.moveStart('character', s)
      range.select()
      return @

  namespace 'Femto.utils', (exports) ->
    exports.IESelection = IESelection
    exports.Selection = IESelection
