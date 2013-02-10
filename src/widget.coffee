#<< utils/type

Widget = (selector='<div>', context) ->
  if selector instanceof jQuery
    elem = selector
  else
    elem = $(selector, context)
  elem.nonContentWidth = (includeMargin=false) ->
    return @outerWidth(includeMargin) - @width()
  elem.nonContentHeight = (includeMargin=false) ->
    return @outerHeight(includeMargin) - @height()
  elem._outerWidth = elem.outerWidth
  elem.outerWidth = (includeMargin=false, value) ->
    if not includeMargin?
      return @_outerWidth()
    if utils.type(includeMargin) is 'number'
      value = includeMargin
      includeMargin = false
    offset = @nonContentWidth(includeMargin)
    return @width(value - offset)
  elem._outerHeight = elem.outerHeight
  elem.outerHeight = (includeMargin=false, value) ->
    if not includeMargin?
      return @_outerHeight()
    if utils.type(includeMargin) is 'number'
      value = includeMargin
      includeMargin = false
    offset = @nonContentHeight(includeMargin)
    return @height(value - offset)
  return elem
