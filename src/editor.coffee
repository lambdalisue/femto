#<< widget
Editor = (config, textarea) ->
  ###
  Create a Editor jQuery element

  Args
    config - dictionary type configure
    textarea - an instance of textarea. used as a base element

  Return
    Editor jQuery element
  ###
  textarea = Widget(config, textarea)
  textarea.css
    margin: '0'
    padding: '0'
    border: 'none'
    outline: 'none'
    resize: 'none'
  caretaker = new Caretaker()
  # save a memento everytime when user press
  # 13 - Return, 9 - Tab, 8 - BackScape, 46 - Delete
  textarea.on 'keydown', (e) ->
    caretaker.save() if e.which in [13, 9, 8, 46]
  # save a memento everytime when user paste/drop text
  textarea.on 'paste,drop', (e) ->
    caretaker.save()
  # add indent feature
  if Femto.Indent? and config.enableTabIndent
    textarea._indent = new Femto.Indent(textarea, config.tabString)
    textarea._indent.enable()
  # add autoindent feature
  if Femto.AutoIndent? and config.enableAutoIndent
    textarea._autoIndent = new Femto.AutoIndent(textarea, config.tabString)
    textarea._autoIndent.enable()
  # wrap textarea with the wrapper
  elem = Widget config
  elem.addClass 'panel'
  elem.addClass 'editor'
  elem._append textarea
  elem._textarea = textarea
  elem._adjust = ->
    ### adjust inner element size ###
    textarea._outerWidth true, @width()
    textarea._outerHeight true, @height()
  elem._val = (value) ->
    if value?
      textarea.val(value)
      return @
    return textarea.val()
  # configure caretaker
  elem._caretaker = caretaker.originator(elem)
  elem.createMemento = elem._val
  elem.setMemento = elem._val
  # save initial
  caretaker.save()
  return elem
