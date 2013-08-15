###
Base class for Originator

@example
  class Notebook extends utils.Originator
    constructor: ->
      @value = ""
    createMemento: -> @value
    setMemento: (memento) -> @value = memento
###
class Originator
  ###
  Create memento of the instance

  @return [Object] a memento of the instance

  @note Subclass must overload this method
  @throw Not implemented yet
  ###
  createMemento: -> throw Error("Not implemented yet")
  ###
  Set memento of the instance

  @param [Object] memento a memento of the instance

  @note Subclass must overload this method
  @throw Not implemented yet
  ###
  setMemento: (memento) -> throw Error("Not implemented yet")


###
Caretaker of `Originator`

@example
  # see the example of Originator
  notebook = new Notebook()
  notebook.caretaker = new Caretaker(notebook)
  # save the changes
  notebook.caretaker.save()
  # undo the changes
  notebook.caretaker.undo()
  # redo the changes
  notebook.caretaker.redo()
###
class Caretaker
  ###
  Constructor

  @param [Originator] originator an instance of originator subclass
  @return [Caretaker] the new instance
  ###
  constructor: (originator) ->
    @_originator = originator
    @_undoStack = []
    @_redoStack = []
    @_previous = null

  ###
  Get originator when called without any argument.
  Set originator when called with an argument.

  @param [Originator] originator set originator of the instance to this.
  @return [Originator, Caretaker] return Originator instance when called
    without any argument. return this instance when called with an argument.
  ###
  originator: (originator) ->
    if originator?
      @_originator = originator
      return @
    return @_originator

  ###
  Save a memento of the originator to the undo memento stack.
  Nothing will be saved if the same memento was saved previously.

  @param [Object] memento a memento to store. `createMemento()` of the
    originator will be used when no memento is specified.
  @return [Caretaker] the instance
  ###
  save: (memento) ->
    memento = memento or @originator().createMemento()
    if not @_previous? or @_previous isnt memento
      if @_undoStack.length == 0 and memento isnt ""
        @_undoStack.push ""
      @_undoStack.push memento
      @_redoStack = []
      @_previous = memento
    return @

  ###
  Restore a value of the originator from the undo memento stack.
  The current value of the originator will be stack on the redo memento stack.

  @return [Caretaker] the instance

  @note Nothing will be happen when no memento was stacked on undo memento stack.
  ###
  undo: ->
    return @ if not @canUndo()
    originator = @originator()
    # Get current memento of the originator
    # and store on `_redoStack` for redo
    @_redoStack.push originator.createMemento()
    # Get previous memento and set it to the originator
    originator.setMemento @_undoStack.pop()
    return @

  ###
  Restore a value of the originator from the redo memento stack.
  The current value of the originator will be stack on the undo memento stack.

  @return [Caretaker] the instance

  @note Nothing will be happen when no memento was stacked on redo memento stack.
  ###
  redo: ->
    return @ if not @canRedo()
    originator = @originator()
    # Get current memento of the originator
    # and store on `_undoStack` for undo
    @_undoStack.push originator.createMemento()
    # Get next memento and set it to the originator
    originator.setMemento @_redoStack.pop()
    return @

  ###
  Return whether the undo memento stack isn't empty or not

  @return [Boolean] return `true` if the undo memento stack is not empty
  ###
  canUndo: ->
    return @_undoStack.length > 0

  ###
  Return whether the redo memento stack isn't empty or not

  @return [Boolean] return `true` if the redo memento stack is not empty
  ###
  canRedo: ->
    return @_redoStack.length > 0


if exports?
  exports.Originator = Originator
  exports.Caretaker = Caretaker

if namespace?
  namespace 'Femto.utils', (exports) ->
    exports.Originator = Originator
    exports.Caretaker = Caretaker
