#<< parsers/parser
#<< widget/widget
#<< widget/iframe
Viewer = (textarea, template, parser) ->
  iframe = Femto.widget.IFrame()
  elem = Femto.widget.Widget()
  elem.addClass('panel').addClass('viewer')
  elem.append(iframe)
  elem.iframe = iframe
  elem.textarea = textarea
  elem.template = template
  elem.curtain = Femto.utils.Curtain(elem)
  if parser? and not parser instanceof Parser
    parser = new Parser(parser)
  elem.parser = parser
  elem.init = ->
    iframe.init()
    return @
  elem.focus = ->
    iframe.focus()
    return @
  elem.blur = ->
    iframe.blur()
    return @
  elem.val = (value) ->
    render = (value) =>
      @template.render(value, (value) => @iframe.write(value))
    if @parser?
      if @parser.async? is true
        @parser(value, render)
      else
        render(@parser(value))
    else
      render(value)
    return @
  elem.wait = ->
    elem.curtain.addClass 'waiting'
    elem.curtain.show()
    return @
  elem.done = ->
    elem.curtain.hide()
    elem.curtain.removeClass 'waiting'
    return @
  return elem

namespace 'Femto.widget', (exports) ->
  exports.Viewer = Viewer
