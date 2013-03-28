#<< utils/curtain
#<< widget/widget
IFrame = ->
  raw = doc = null
  elem = Femto.widget.Widget('<iframe>')
  elem.css
    margin: 0
    padding: 0
    border: 'none'
    outline: 'none'
    resize: 'none'
    overflow: 'scroll'
    width: '100%'
    height: '100%'
  elem.attr('frameborder', 0)
  elem.focus = ->
    raw.contentWindow.focus()
    return @
  elem.blur = ->
    raw.contentWindow.document.body.blur()
    return @
  elem.init = ->
    raw = @get(0)
    if raw.contentDocument?
      doc = raw.contentDocument
    else
      doc = raw.contentWindow.document
    doc.write '<body></body>'
    style = doc.body.style
    style.margin = '0'
    style.padding = '0'
    style.width = '100%'
    style.height = '100%'
    @document = doc
    return @
  elem.write = (value) ->
    if doc?
      try
        scrollTop = doc.documentElement.scrollTop
      catch e
        scrollTop = 0
      doc.open()
      doc.write value
      doc.close()
      # replace all anchor links to _blank
      $(doc).find('a').attr('target', '_blank')
      doc.documentElement.scrollTop = scrollTop
    return @
  return elem

namespace 'Femto.widget', (exports) ->
  exports.IFrame = IFrame
