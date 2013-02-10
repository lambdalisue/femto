#<< widget
#<< utils/undo
Editor = (textarea) ->
  textarea = Widget(textarea)
  textarea.css
    margin: '0'
    padding: '0'
    border: 'none'
    outline: 'none'
    resize: 'none'
  textarea.createMemento = textarea.val
  textarea.setMemento = textarea.val
  # wrap textarea with the wrapper
  elem = Widget()
  elem.addClass('panel').addClass('editor')
  elem.append textarea
  elem.textarea = textarea
  elem.adjust = ->
    textarea.outerWidth true, @width()
    textarea.outerHeight true, @height()
  elem.val = -> textarea.val(arguments...)
  # configure caretaker
  elem.caretaker = caretaker = (new utils.Caretaker(textarea)).save()
  # save a memento everytime when user press
  # 13 - Return, 9 - Tab, 8 - BackScape, 46 - Delete
  textarea.on 'keydown', (e) ->
    caretaker.save() if e.which in [13, 9, 8, 46]
  # save a memento everytime when user paste/drop text
  textarea.on 'paste,drop', (e) ->
    caretaker.save()
  return elem
