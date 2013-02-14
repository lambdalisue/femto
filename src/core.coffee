#<< editor

window.Femto = (textarea, options) ->
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

  return elem.init()

