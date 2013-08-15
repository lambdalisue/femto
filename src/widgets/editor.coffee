#<< widgets/widget
#<< widgets/textarea
editor = (selector, context, options) ->
  ###
  Create an editor widget instance

  @param [String or Object] an textarea selector or jQuery instance
  @param [Object] context a context of jQuery
  @param [Object] options an options of femto
  @return [Object] return an extended jQuery instance

  ###
  textarea = Femto.widgets.textarea(selector, context, options)
  textarea.css
    margin: '0'
    padding: '0'
    border: 'none'
    outline: 'none'
    resize: 'none'
    width: '100%'
    height: '100%'
  # wrap textarea with the wrapper
  elem = Femto.widgets.widget()
  elem.addClass('panel').addClass('editor')
  elem.append textarea
  elem.textarea = textarea
  elem.selection = textarea._selection
  elem.caretaker = textarea._caretaker
  elem.shifter = textarea._shifter
  elem.focus = ->
    textarea.focus()
    return @
  elem.blar = ->
    textarea.blar()
    return @
  elem.val = -> textarea.val(arguments...)
  elem.widget = 'editor'
  return elem

namespace 'Femto.widgets', (exports) ->
  exports.editor = editor
