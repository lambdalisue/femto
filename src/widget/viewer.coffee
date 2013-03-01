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
  elem.curtain = iframe.curtain
  elem.parser = null
  elem.init = ->
    @iframe.init()
    return @
  elem.adjust = ->
    iframe.outerWidth true, @width()
    iframe.outerHeight true, @height()
    return @
  elem.focus = ->
    iframe.focus()
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
