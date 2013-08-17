(function() {
  var Caretaker, Originator;

  Originator = (function() {

    function Originator() {}

    Originator.prototype.createMemento = function() {
      throw Error("Not implemented yet");
    };

    Originator.prototype.setMemento = function(memento) {
      throw Error("Not implemented yet");
    };

    return Originator;

  })();

  Caretaker = (function() {

    function Caretaker(originator) {
      this._originator = originator;
      this._undoStack = [];
      this._redoStack = [];
      this._previous = null;
    }

    Caretaker.prototype.originator = function(originator) {
      if (originator != null) {
        this._originator = originator;
        return this;
      }
      return this._originator;
    };

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

    Caretaker.prototype.canUndo = function() {
      return this._undoStack.length > 0;
    };

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
