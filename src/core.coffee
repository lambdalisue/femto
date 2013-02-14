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
  for name, plugin of Femto.plugins
    console.debug "Appling Femto plugin (#{name}) ..."
    plugin(elem)

  return elem.init().adjust()

Femto.plugins = {}

Femto.plugins.indenty = (femto) ->
  editor = femto.editor
  editor.indenty = new utils.Indenty(editor.textarea)
  editor.indenty.enable()

Femto.plugins.autoIndenty = (femto) ->
  editor = femto.editor
  editor.autoIndenty = new utils.AutoIndenty(editor.textarea)
  editor.autoIndenty.enable()
