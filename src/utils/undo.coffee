class utils.Originator
  createMemento: -> throw Error("Not implemented yet")
  setMemento: (memento) -> throw Error("Not implemented yet")


class utils.Caretaker
  constructor: (originator) ->
    @_originator = originator
    @_undoStack = []
    @_redoStack = []
    @_previous = null

  originator: (originator) ->
    if originator?
      @_originator = originator
      return @
    return @_originator

  save: (memento) ->
    memento = memento or @originator().createMemento()
    if not @_previous? or @_previous isnt memento
      @_undoStack.push memento
      @_redoStack = []
      @_previous = memento
    return @

  undo: ->
    return @ if not @canUndo()
    originator = @originator()
    # Get current memento of the originator
    # and store on `_redoStack` for redo
    @_redoStack.push originator.createMemento()
    # Get previous memento and set it to the originator
    originator.setMemento @_undoStack.pop()
    return @

  redo: ->
    return @ if not @canRedo()
    originator = @originator()
    # Get current memento of the originator
    # and store on `_undoStack` for undo
    @_undoStack.push originator.createMemento()
    # Get next memento and set it to the originator
    originator.setMemento @_redoStack.pop()
    return @

  canUndo: ->
    return @_undoStack.length > 0

  canRedo: ->
    return @_redoStack.length > 0


if exports?
  exports.Originator = Originator
  exports.Caretaker = Caretaker
