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
      # focus the textarea (required)
      @textarea.focus()
      # get the length of selected (normalized) text
      #
      # * the length does not count any trailing newlines because of
      #   specification
      #
      range = @_document.selection.createRange()
      selectl = range.text.replace(/\r/g, '').length
      # create TextRange object which address the textarea element
      #
      # * a TextRange object created from textarea does not have `setEndPoint`
      #   method that's why the TextRange object is created from body and moved
      #   to the textarea
      #
      trange = @_document.body.createTextRange()
      trange.moveToElementText(@textarea)
      # get entire text length of textarea.
      #
      # * it is similar with `textarea.value.length` but from IE specification,
      #   A value of TextRange does not contain any trailing NEWLINEs that's why
      #   using `textarea.value.length` might be conflict and could not be used
      #
      entirel = trange.text.replace(/\r/g, '').length
      # move the TextRange start point to the start point of selection (range)
      # the end point remains to the end of the entire text
      trange.setEndPoint('StartToStart', range)
      # calculate the start point. the start point is calculated as
      #
      #   a a a a N b b b b N c c c c N
      #  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
      #                |=======|
      #
      #  s = entirel (aaaaNbbbbNcccc: 14) - rhs (bbNcccc: 7)
      #  e = s + selectl (bbNc: 4)
      #
      s = entirel - trange.text.replace(/\r/g, '').length
      e = s + selectl
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
      range.moveEnd('character', e)
      range.moveStart('character', s)
      # set the caret really
      range.select()
      return @

  namespace 'Femto.utils', (exports) ->
    exports.IESelection = IESelection
    exports.Selection = IESelection
