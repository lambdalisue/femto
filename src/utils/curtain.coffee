Curtain = (widget) ->
  if widget.css('position') is 'static'
    widget.css('position', 'relative')
  elem = $('<div>').appendTo(widget).hide().css
    position: 'absolute'
    top: 0
    left: 0
    overflow: 'hidden'
    'z-index': 10000
    width: '100%'
    height: '100%'
  elem.adjust = ->
    @width widget.outerWidth(true)
    @height height.outerHeight(true)
    return @
  elem.show = ->
    @adjust()
    jQuery::show.apply(@, arguments)
    return @
  return elem

namespace 'Femto.utils', (exports) ->
  exports.Curtain = Curtain
