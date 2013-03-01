#<< widget/widget
#<< utils/undo
###
Femto Editor widget

@param [jQuery] textarea A jQuery instance of target textarea DOM element
@return [jQuery extend] extended jQuery instance which contains the textarea

@example
  textarea = document.createElement('textarea')
  textarea = jQuery(textarea)
  editor = Femto.widget.Editor(textarea)
  # set focus
  editor.focus()
  # set value
  editor.val("Hello")
  # get value
  console.log editor.val()
###
Editor = (textarea) ->
  raw = textarea.get(0)
  textarea = Femto.widget.Widget(textarea)
  textarea.css
    margin: '0'
    padding: '0'
    border: 'none'
    outline: 'none'
    resize: 'none'
    width: '100%'
    height: '100%'
  textarea.setMemento = textarea.val
  textarea.createMemento = textarea.val
  textarea._caretaker = new Femto.utils.Caretaker(textarea)
  textarea._caretaker.save()
  textarea._selection = new Femto.utils.Selection(raw)
  # wrap textarea with the wrapper
  elem = Femto.widget.Widget()
  elem.addClass('panel').addClass('editor')
  elem.append textarea
  elem.textarea = textarea
  elem.selection = textarea._selection
  elem.caretaker = textarea._caretaker
  ###
  Focus the widget
  ###
  elem.focus = ->
    textarea.focus()
    return @
  elem.adjust = ->
    textarea.outerWidth true, @width()
    textarea.outerHeight true, @height()
  ###
  Get or set the value of the widget
  ###
  elem.val = -> textarea.val(arguments...)
  # configure caretaker
  textarea.on 'keydown', (e) ->
    # save a memento everytime when user press
    # 13 - Return, 9 - Tab, 8 - BackScape, 46 - Delete
    textarea._caretaker.save() if e.which in [13, 9, 8, 46]
    # call undo/redo with Ctrl+Z / Ctrl+Shift+Z
    if e.which is 90 and e.ctrlKey
      if e.shiftKey
        textarea._caretaker.redo()
      else
        textarea._caretaker.undo()
      # cancel bubbling
      e.stopPropagation()
      e.stopImmediatePropagation()
      # stop default
      e.preventDefault()
      return false
  # save a memento everytime when user paste/drop text
  textarea.on 'paste,drop', (e) ->
    textarea._caretaker.save()
  return elem

namespace 'Femto.widget', (exports) ->
  exports.Editor = Editor
