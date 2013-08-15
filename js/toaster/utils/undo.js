
/*
Base class for Originator

@example
  class Notebook extends utils.Originator
    constructor: ->
      @value = ""
    createMemento: -> @value
    setMemento: (memento) -> @value = memento
*/


(function() {
  var Caretaker, Originator;

  Originator = (function() {

    function Originator() {}

    /*
      Create memento of the instance
    
      @return [Object] a memento of the instance
    
      @note Subclass must overload this method
      @throw Not implemented yet
    */


    Originator.prototype.createMemento = function() {
      throw Error("Not implemented yet");
    };

    /*
      Set memento of the instance
    
      @param [Object] memento a memento of the instance
    
      @note Subclass must overload this method
      @throw Not implemented yet
    */


    Originator.prototype.setMemento = function(memento) {
      throw Error("Not implemented yet");
    };

    return Originator;

  })();

  /*
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
  */


  Caretaker = (function() {
    /*
      Constructor
    
      @param [Originator] originator an instance of originator subclass
      @return [Caretaker] the new instance
    */

    function Caretaker(originator) {
      this._originator = originator;
      this._undoStack = [];
      this._redoStack = [];
      this._previous = null;
    }

    /*
      Get originator when called without any argument.
      Set originator when called with an argument.
    
      @param [Originator] originator set originator of the instance to this.
      @return [Originator, Caretaker] return Originator instance when called
        without any argument. return this instance when called with an argument.
    */


    Caretaker.prototype.originator = function(originator) {
      if (originator != null) {
        this._originator = originator;
        return this;
      }
      return this._originator;
    };

    /*
      Save a memento of the originator to the undo memento stack.
      Nothing will be saved if the same memento was saved previously.
    
      @param [Object] memento a memento to store. `createMemento()` of the
        originator will be used when no memento is specified.
      @return [Caretaker] the instance
    */


    Caretaker.prototype.save = function(memento) {
      memento = memento || this.originator().createMemento();
      if (!(this._previous != null) || this._previous !== memento) {
        if (this._undoStack.length === 0 && memento !== "") {
          this._undoStack.push("");
        }
        this._undoStack.push(memento);
        this._redoStack = [];
        this._previous = memento;
      }
      return this;
    };

    /*
      Restore a value of the originator from the undo memento stack.
      The current value of the originator will be stack on the redo memento stack.
    
      @return [Caretaker] the instance
    
      @note Nothing will be happen when no memento was stacked on undo memento stack.
    */


    Caretaker.prototype.undo = function() {
      var originator;
      if (!this.canUndo()) {
        return this;
      }
      originator = this.originator();
      this._redoStack.push(originator.createMemento());
      originator.setMemento(this._undoStack.pop());
      return this;
    };

    /*
      Restore a value of the originator from the redo memento stack.
      The current value of the originator will be stack on the undo memento stack.
    
      @return [Caretaker] the instance
    
      @note Nothing will be happen when no memento was stacked on redo memento stack.
    */


    Caretaker.prototype.redo = function() {
      var originator;
      if (!this.canRedo()) {
        return this;
      }
      originator = this.originator();
      this._undoStack.push(originator.createMemento());
      originator.setMemento(this._redoStack.pop());
      return this;
    };

    /*
      Return whether the undo memento stack isn't empty or not
    
      @return [Boolean] return `true` if the undo memento stack is not empty
    */


    Caretaker.prototype.canUndo = function() {
      return this._undoStack.length > 0;
    };

    /*
      Return whether the redo memento stack isn't empty or not
    
      @return [Boolean] return `true` if the redo memento stack is not empty
    */


    Caretaker.prototype.canRedo = function() {
      return this._redoStack.length > 0;
    };

    return Caretaker;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    exports.Originator = Originator;
    exports.Caretaker = Caretaker;
  }

  if (typeof namespace !== "undefined" && namespace !== null) {
    namespace('Femto.utils', function(exports) {
      exports.Originator = Originator;
      return exports.Caretaker = Caretaker;
    });
  }

}).call(this);
