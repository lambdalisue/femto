#<< utils/extend
#<< utils/undo
#<< utils/indent

# Transform a normal textarea to femto
#
# @param [Object] textarea a textarea DOM element
# @option options [Boolean] caretaker enable caretaker feature (Undo/Redo)
# @option options [Boolean] indent enable indent feature
# @option options [Boolean] expandTab use continuous spaces instead of tab
# @option options [Integer] indentLevel the number of spaces for indent
# @return [Object] a textarea DOM element with several features
transform = (textarea, options={}) ->
  options = Femto.utils.extend(options,{
    'caretaker': true
    'indent': true
    'expandTab': true
    'indentLevel': 4
  })
  # save options
  femto = {}
  femto.options = options
  # create originator and caretaker
  originator = new Femto.utils.Originator()
  originator.createMemento = ->
    return textarea.value
  originator.setMemento = (value) ->
    textarea.value = value
  caretaker = new Femto.utils.Caretaker(originator)
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
      # cancel bubbling immediately
      #e.stopImmediatePropagation()
      # cancel bubbling and default behavior
      e.stopPropagation()
      e.preventDefault()
  # create indent
  indent = new Femto.utils.Indent(textarea, options)
  # save instances
  femto.originator = originator
  femto.caretaker = caretaker
  femto.indent = indent
  femto.caret = indent.caret
  femto.linecaret = indent.linecaret
  # create and register event
  femto._keyDownEvent = (e) ->
    caretaker._keyDownEvent(e) if options.caretaker
    indent._keyDownEvent(e) if options.indent
  femto._caretakerEvent = (e) ->
    caretaker.save() if options.caretaker
  femto.enable = ->
    textarea.addEventListener('keydown', femto._keyDownEvent, false)
    textarea.addEventListener('paste', femto._caretakerEvent, false)
    textarea.addEventListener('drop', femto._caretakerEvent, false)
  femto.disable = ->
    textarea.removeEventListener('keydown', femto._keyDownEvent, false)
    textarea.removeEventListener('paste', femto._caretakerEvent, false)
    textarea.removeEventListener('drop', femto._caretakerEvent, false)
  femto.enable()
  textarea.femto = femto
  return textarea

# Transform all normal textarea in the document to femto
#
# @option options [Boolean] caretaker enable caretaker feature (Undo/Redo)
# @option options [Boolean] indent enable indent feature
# @option options [Boolean] expandTab use continuous spaces instead of tab
# @option options [Integer] indentLevel the number of spaces for indent
# @return [Object] a textarea DOM element with several features
transformAll = (options) ->
  slist = document.getElementsByTagName('textarea')
  dlist = []
  for textarea in slist
    dlist.push(transform(textarea))
  return dlist

namespace 'Femto', (exports) ->
  exports.transform = transform
  exports.transformAll = transformAll
