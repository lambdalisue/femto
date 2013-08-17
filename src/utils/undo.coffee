# Base class for Originator
# 
# @see Caretaker
# @example
#   class Notebook extends utils.Originator
#     constructor: ->
#       @value = ""
#     createMemento: -> @value
#     setMemento: (memento) -> @value = memento
class Originator
  # Create memento of the instance
  #
  # @return [Object] a memento of the instance
  # @throw [Error] throw "Not implemented yet" error
  # @note Subclass must overload this method
  createMemento: -> throw Error("Not implemented yet")
  # Set memento of the instance
  #
  # @param [Object] memento a memento of the instance
  # @return [Originator] an instance of Originator
  # @throw [Error] throw "Not implemented yet" error
  # @note Subclass must overload this method
  setMemento: (memento) -> throw Error("Not implemented yet")


# Caretaker of `Originator`
# 
# @see Originator
# @example
#   # see the example of Originator
#   notebook = new Notebook()
#   notebook.caretaker = new Caretaker(notebook)
#   # save the changes
#   notebook.caretaker.save()
#   # undo the changes
#   notebook.caretaker.undo()
#   # redo the changes
#   notebook.caretaker.redo()
class Caretaker
  # Construct a new caretaker instance
  #
  # @param [Originator] originator an instance of originator subclass
  # @example
  #   # define originator required function (or make subclass of originator)
  #   originator = new Originator()
  #   originator.createMemento = -> @_memento
  #   originator.setMemento = (value) -> @_memento = value
  #   # create caretaker
  #   caretaker = new Caretaker(originator)
  constructor: (originator) ->
    @_originator = originator
    @_undoStack = []
    @_redoStack = []
    @_previous = null

  # Get or set an originator instance
  #
  # @overload originator()
  #   Get an originator instance
  #   @return [Originator] an instance of Originator
  #
  # @overload originator(originator)
  #   Set an originator instance
  #   @param [Originator] originator a new originator instance
  #   @return [Caretaker] an instance of Caretaker
  originator: (originator) ->
    if originator?
      @_originator = originator
      return @
    return @_originator

  # Save a memento of the originator to an undo memento stock. A redo memento
  # stock will be cleared.
  #
  # @note Nothing will be saved when the current memento is save as the
  #   previous one.
  #
  # @overload save()
  #   Save a current memento of the originator to an undo memento stock.
  #   The current memento will be obtain by calling `createMemento()` method
  #   of the originator.
  #   @return [Caretaker] an instance of Caretaker
  #
  # @overload save(memento)
  #   Save a specified memento (`memento`) of the originator to an undo
  #   memento stock.
  #   @param [Object] memento a memento which will be stored
  #   @return [Caretaker] an instance of Caretaker
  #
  # @see Originator#createMemento
  # @example
  #   # automatically create memento of the originator by calling
  #   # `createMemento()`
  #   caretaker.save()
  #   # manually create memento of the originator
  #   memento = originator.createMemento() + "Hello"
  #   caretaker.save(memento)
  save: (memento) ->
    memento = memento or @originator().createMemento()
    if not @_previous? or @_previous isnt memento
      if @_undoStack.length == 0 and memento isnt ""
        @_undoStack.push ""
      @_undoStack.push memento
      @_redoStack = []
      @_previous = memento
    return @

  # Restore a value of the originator from an undo memento stock.
  # The current memento will be stock on a redo memento stock
  #
  # @note Nothing will be restored or stored when no memento was stocked on
  #   an undo memento stock
  # @return [Caretaker] an instance of Caretaker
  # @see Caretaker#canUndo
  # @see Caretaker#redo
  undo: ->
    return @ if not @canUndo()
    originator = @originator()
    # Get current memento of the originator
    # and store on `_redoStack` for redo
    @_redoStack.push originator.createMemento()
    # Get previous memento and set it to the originator
    originator.setMemento @_undoStack.pop()
    return @

  # Restore a value of the originator from an redo memento stock.
  # The current memento will be stock on a undo memento stock
  #
  # @note Nothing will be restored or stored when no memento was stocked on
  #   an redo memento stock
  # @return [Caretaker] an instance of Caretaker
  # @see Caretaker#canRedo
  # @see Caretaker#undo
  redo: ->
    return @ if not @canRedo()
    originator = @originator()
    # Get current memento of the originator
    # and store on `_undoStack` for undo
    @_undoStack.push originator.createMemento()
    # Get next memento and set it to the originator
    originator.setMemento @_redoStack.pop()
    return @

  # Return `true` when an undo memeto stock has at least one memento
  #
  # @return [Boolean] return `true` if an undo memento stock is not empty
  # @see Caretaker#undo
  # @see Caretaker#canRedo
  canUndo: ->
    return @_undoStack.length > 0

  # Return `true` when an redo memeto stock has at least one memento
  #
  # @return [Boolean] return `true` if an redo memento stock is not empty
  # @see Caretaker#redo
  # @see Caretaker#canUndo
  canRedo: ->
    return @_redoStack.length > 0


if exports?
  exports.Originator = Originator
  exports.Caretaker = Caretaker

if namespace?
  namespace 'Femto.utils', (exports) ->
    exports.Originator = Originator
    exports.Caretaker = Caretaker
