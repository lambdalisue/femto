#<< widgets/widget
#<< utils/undo
#<< utils/shifter
textarea = (selector, context, options) ->
  ###
  Create an textarea widget instance

  @param [String | Object] selector a textarea selector or jQuery instance
  @param [Object] context a context of jQuery
  @param [Object] options an options of femto
  @return [Object] extended jQuery instance
  ###
  elem = Femto.widgets.widget(selector, context)
  # enable Undo/Redo feature
  elem.createMemento = elem.val
  elem.setMemento = elem.val
  caretaker = new Femto.utils.Caretaker(elem)
  caretaker.save()
  caretaker._keyDownEvent = (e) ->
    # save a memento everytime when user press
    # 13 - Return, 9 - Tab, 8 - BackScape, 46 - Delete
    caretaker.save() if e.which in [13, 9, 8, 46]
    if e.which is 90 and e.ctrlKey
      if e.shiftKey
        caretaker.redo()
      else
        caretaker.undo()
      # cancel bubbling
      e.stopPropagation()
      e.stopImmediatePropagation()
      # stop default
      e.preventDefault()
      return false
    return true
  # enable Selection
  selection = new Femto.utils.Selection(elem.get(0))
  # enable Shift feature
  shifter = new Femto.utils.Shifter(
    elem, selection,
    options.expandTab,
    options.indentLevel)
  # register event
  elem.on 'keydown', (e) ->
    result = true
    result = result and shifter._keyDownEvent(e)
    result = result and caretaker._keyDownEvent(e)
    return result
  elem.on 'paste,drop', (e) ->
    caretaker.save()
  # save instances in elem instance
  elem._caretaker = caretaker
  elem._selection = selection
  elem._shifter = shifter
  # register shortcut methods
  elem.save = -> @_caretaker.save(arguments...)
  elem.undo = -> @_caretaker.undo(arguments...)
  elem.redo = -> @_caretaker.redo(arguments...)
  elem.indent = -> @_shifter.indent(arguments...)
  elem.outdent = -> @_shifter.outdent(arguments...)
  elem.insertNewLine = -> @_shifter.insertNewLine(arguments...)
  elem.widget = 'textarea'
  return elem

namespace 'Femto.widgets', (exports) ->
  exports.textarea = textarea
