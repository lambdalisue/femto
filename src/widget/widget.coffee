#<< utils/type
Widget = (selector='<div>', context) ->
  if selector instanceof jQuery
    elem = selector
  else
    elem = $(selector, context)
  _outerWidth = jQuery::outerWidth
  _outerHeight = jQuery::outerHeight
  elem.nonContentWidth = (includeMargin=false) ->
    return _outerWidth.call(@, includeMargin) - @width()
  elem.nonContentHeight = (includeMargin=false) ->
    return _outerHeight.call(@, includeMargin) - @height()
  elem.outerWidth = (includeMargin, value) ->
    if Femto.utils.type(includeMargin) is 'number'
      value = includeMargin
      includeMargin = false
    if not value?
      return _outerWidth.call(@)
    offset = @nonContentWidth(includeMargin)
    return @width(value - offset)
  elem._outerHeight = elem.outerHeight
  elem.outerHeight = (includeMargin, value) ->
    if Femto.utils.type(includeMargin) is 'number'
      value = includeMargin
      includeMargin = false
    if not value?
      return _outerHeight.call(@)
    offset = @nonContentHeight(includeMargin)
    return @height(value - offset)
  elem.widget = true
  return elem

namespace 'Femto.widget', (exports) ->
  exports.Widget = Widget
