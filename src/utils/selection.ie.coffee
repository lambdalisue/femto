#<< utils/selection
if document.selection?
  ###
  Textarea selection class for IE

  Note:
    You must know the following IE specification to understand this library

      1.  A value of TextRange (`text`) does not contain trailing NEWLINEs
      2.  The NEWLINE is composed with two character "\r\n"
      3.  Caret moving functions (like `moveStart`, `moveEnd`) treat NEWLINEs
          as ONE character (position), on the other hand text manipulating
          functions (like `substr`) treat it as TWO character (\r\n)

    And there are several more SPECIFICATION written as comments in code.

  ###
  class IESelection extends Femto.utils.W3CSelection
    constructor: (@textarea) ->
      @_document = @textarea.ownerDocument

    _getWholeText: ->
      return @textarea.value.replace(/\r/g, '')

    _getCaret: ->
      #
      # Storategy note:
      #
      #   moveStart/moveEnd method return the number of character moved.
      #   so if the offset (count) is the length of the entire text, the
      #   returning value should be the offset.
      #
      #   And also, moveStart/moveEnd count Newline as one character, on the
      #   other hand, text manipulating method count Newline as two character.
      #   That's why normalizedValue (\r\n -> \n) should be used to calculate
      #   the length
      #
      s = e = 0
      textarea = @textarea
      # get the selected range
      range = @_document.selection.createRange()

      # this method only work when the target element is selected and the
      # selection is presence.
      if range and range.parentElement() is textarea
        # get normalized length because moveStart/moveEnd count newline as one
        # character
        normalizedLength = textarea.value.replace(/\r/g, '').length

        # create a working TextRange that lives only in the input and move to
        # the selection
        trange = textarea.createTextRange()
        trange.moveToBookmark(range.getBookmark())

        # check if the start/end of the selection are at the end of the
        # textarea since moveStart/moveEnd does not return expected value
        marker = textarea.createTextRange()
        marker.collapse(false)

        if trange.compareEndPoints('StartToEnd', marker) > -1
          # the start position is at very end of the textarea
          s = e = normalizedLength
        else
          # moveStart return the number of character moved so move the start
          # position back as normalizedLength to get the start position
          s = -trange.moveStart('character', -normalizedLength)

          if trange.compareEndPoints('EndToEnd', marker) > -1
            # the end position is at very end of the textarea
            e = normalizedLength
          else
            # moveEnd return the number of character moved so move the end
            # position back as normalizedLength to get the end position
            e = -trange.moveEnd('character', -normalizedLength)
      return [s, e]

    _setCaret: (s, e) ->
      range = @textarea.createTextRange()
      # correct the caret to beggining of the textarea
      range.collapse(true)
      # set caret position
      #
      # * `moveStart` affect the end point as well (because end point cannot be
      #   behind the start point) so `moveEnd` should be called before the
      #   `moveStart` or 2nd argument should be the offset from start point
      #   See: http://msdn.microsoft.com/ja-jp/library/ie/ms536620(v=vs.85).aspx
      #
      range.moveStart('character', s)
      range.moveEnd('character', e-s)
      # set the caret really
      range.select()
      return @

  namespace 'Femto.utils', (exports) ->
    exports.IESelection = IESelection
    exports.Selection = IESelection
