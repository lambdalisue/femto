#<< widget/widget
#<< utils/undo
Editor = (textarea) ->
  raw = textarea.get(0)
  textarea = Femto.widget.Widget(textarea)
  textarea._selection = new Femto.utils.Selection(raw)
  textarea.css
    margin: '0'
    padding: '0'
    border: 'none'
    outline: 'none'
    resize: 'none'
    width: '100%'
    height: '100%'
  textarea.createMemento = textarea.val
  textarea.setMemento = textarea.val
  # wrap textarea with the wrapper
  elem = Femto.widget.Widget()
  elem.addClass('panel').addClass('editor')
  elem.append textarea
  elem.textarea = textarea
  elem.selection = textarea._selection
  elem.focus = ->
    textarea.focus()
    return @
  elem.adjust = ->
    textarea.outerWidth true, @width()
    textarea.outerHeight true, @height()
  elem.val = -> textarea.val(arguments...)
  # configure caretaker
  elem.caretaker = caretaker = (new Femto.utils.Caretaker(textarea)).save()
  # save a memento everytime when user press
  # 13 - Return, 9 - Tab, 8 - BackScape, 46 - Delete
  textarea.on 'keydown', (e) ->
    caretaker.save() if e.which in [13, 9, 8, 46]
  # save a memento everytime when user paste/drop text
  textarea.on 'paste,drop', (e) ->
    caretaker.save()
  return elem

namespace 'Femto.widget', (exports) ->
  exports.Editor = Editor
