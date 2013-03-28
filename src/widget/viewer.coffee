#<< widget/widget
#<< widget/iframe
Viewer = (textarea, template) ->
  iframe = Femto.widget.IFrame()
  elem = Femto.widget.Widget()
  elem.addClass('panel').addClass('viewer')
  elem.append(iframe)
  elem.iframe = iframe
  elem.textarea = textarea
  elem.template = template
  elem.curtain = Femto.utils.Curtain(elem)
  elem.parser = null
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
      @parser.parse(value, render)
    else
      render(value)
    return @
  return elem

namespace 'Femto.widget', (exports) ->
  exports.Viewer = Viewer
