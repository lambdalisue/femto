#<< utils/caret

# A textarea line caret management class
class LineCaret extends Femto.utils.Caret

  # Get start and end positions of a caret line
  #
  # @overload get()
  #   Get start and end positions of a current caret line
  #   @return [Array<Integer>] an array which first and second items indicate
  #     start and end positions of a line on a caret respectively
  #
  # @overload get(s, e)
  #   Get start and end positions of a specified (`s` and `e`) caret line
  #   @param [Integer] s a start position of a caret. a value of current caret
  #     is used when this is not specified
  #   @param [Integer] e an end position of a caret. a value of current caret
  #     is used when this is not specified
  #   @return [Array<Integer>] an array which first and second items indicate
  #     start and end positions of a line on a caret respectively
  get: (s, e) ->
    if not s? or not e?
      [cs, ce] = super()
      s = s ? cs
      e = e ? ce
    # Note:
    #
    # Normalization (\r\n -> \n) is required at this step if you want to use
    # this libary for Internet Explorer or any browser which use \r\n instead
    # of \n for newline
    #
    # wholeText = @textarea.value.replace(/\r\n/, '\n')
    wholeText = @textarea.value
    ls = wholeText.lastIndexOf("\n", s-1) + 1
    le = wholeText.indexOf("\n", e)
    le = wholeText.length if le is -1
    return [ls, le]

namespace 'Femto.utils', (exports) ->
  exports.LineCaret = LineCaret
