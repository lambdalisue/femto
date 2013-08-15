widget = (selector='<div>', context, options) ->
  ###
  Create an instance of jQuery extend

  @param [String or Object] selector a selector or jQuery instance
  @param [Object] context a context of jQuery
  @param [Object] options an options of femto
  
  @property [Boolean] widget return always true
  @method #nonContntWidth(includeMargin=false)
    Get a total width of the element's non content area
    @param [Boolean] includeMargin if true, returning value include margin area

  @method #nonContntHeight(includeMargin=false)
    Get a total height of the element's non content area
    @param [Boolean] includeMargin if true, returning value include margin area

  @method #outerWidth (includeMargin, value)
    Get or set a outer width of the element
    @param [Boolean] includeMargin if true, returning value include margin area
      or setting value include margin area
    @param [Number] value if it is specified, an element's outer width will be
      set as the value

    @example Get an element's outer width
      widget = Widget()
      widget.outerWidth()           # without margin area
      widget.outerWidth(true)       # with margin area

    @example Set an element's outer width
      widget = Widget()
      widget.outerWidth(100)        # without margin area
      widget.outerWidth(true, 100)  # with margin area

  @method #outerHeight (includeMargin, value)
    Get or set a outer height of the element
    @param [Boolean] includeMargin if true, returning value include margin area
      or setting value include margin area
    @param [Number] value if it is specified, an element's outer height will be
      set as the value

    @example Get an element's outer height
      widget = Widget()
      widget.outerHeight()           # without margin area
      widget.outerHeight(true)       # with margin area

    @example Set an element's outer height
      widget = Widget()
      widget.outerHeight(100)        # without margin area
      widget.outerHeight(true, 100)  # with margin area
  ###
  isof = (obj, type) ->
    if not obj? or not obj
      return false
    cls = Object::toString.call(obj)[8:-1].toLowerCase()
    return cls is type
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
    if isof(includeMargin, 'number')
      value = includeMargin
      includeMargin = false
    if not value?
      return _outerWidth.call(@)
    offset = @nonContentWidth(includeMargin)
    return @width(value - offset)
  elem._outerHeight = elem.outerHeight
  elem.outerHeight = (includeMargin, value) ->
    if isof(includeMargin, 'number')
      value = includeMargin
      includeMargin = false
    if not value?
      return _outerHeight.call(@)
    offset = @nonContentHeight(includeMargin)
    return @height(value - offset)
  elem.widget = 'widget'
  return elem

namespace 'Femto.widgets', (exports) ->
  exports.widget = widget
