#<< editor
#<< utils/indenty
#<< utils/autoindenty
window.Femto = Femto = (textarea, options) ->
  elem = Widget($('<div>').insertAfter(textarea).hide())
                          .addClass('femto')
  elem.editor = Editor(textarea)
  elem.caretaker = elem.editor.caretaker
  elem.append elem.editor

  elem.init = ->
    @editor.init?()
    # show femto
    @show()
    return @

  elem.adjust = ->
    @editor.outerWidth true, @width()
    @editor.outerHeight true, @height()
    @editor.adjust()
    return @

  # Apply plugins
  elem.plugins = {}
  for name, plugin of Femto.plugins
    console.debug "Appling Femto plugin (#{name}) ..."
    plugin(elem)

  return elem.init().adjust()

Femto.plugins = {}

Femto.plugins.indenty = (femto) ->
  textarea = femto.editor.textarea
  femto.plugins.indenty = new utils.Indenty(textarea)
  femto.plugins.indenty.enable()

Femto.plugins.autoIndenty = (femto) ->
  textarea = femto.editor.textarea
  femto.plugins.autoIndenty = new utils.AutoIndenty(textarea)
  femto.plugins.autoIndenty.enable()
