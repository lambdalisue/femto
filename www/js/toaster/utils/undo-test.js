var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('utils.Originator', function() {
  var expected_methods, method, _i, _len, _results;
  expected_methods = ['createMemento', 'setMemento'];
  _results = [];
  for (_i = 0, _len = expected_methods.length; _i < _len; _i++) {
    method = expected_methods[_i];
    _results.push(it("instance should have `" + method + "` method", function() {
      var instance;
      instance = new utils.Originator();
      expect(instance).to.have.property(method);
      return expect(instance[method]).to.be.a('function');
    }));
  }
  return _results;
});

describe('utils.Caretaker', function() {
  var Dummy, dummy, expected_methods, instance, method, _i, _len;
  Dummy = (function(_super) {

    __extends(Dummy, _super);

    function Dummy() {
      return Dummy.__super__.constructor.apply(this, arguments);
    }

    Dummy.prototype.createMemento = function() {
      return this.memento;
    };

    Dummy.prototype.setMemento = function(memento) {
      return this.memento = memento;
    };

    return Dummy;

  })(utils.Originator);
  dummy = new Dummy();
  instance = new utils.Caretaker(dummy);
  expected_methods = ['originator', 'save', 'undo', 'redo', 'canUndo', 'canRedo'];
  for (_i = 0, _len = expected_methods.length; _i < _len; _i++) {
    method = expected_methods[_i];
    it("instance should have `" + method + "` method", function() {
      expect(instance).to.have.property(method);
      return expect(instance[method]).to.be.a('function');
    });
  }
  beforeEach(function() {
    dummy.memento = null;
    instance._undoStack = [];
    instance._redoStack = [];
    instance._previous = null;
    return instance._originator = dummy;
  });
  describe('#originator(originator) -> originator | instance', function() {
    it('should return originator instance when called without any argument', function() {
      var r;
      r = instance.originator();
      expect(r).to.be.a(Dummy);
      return expect(r).to.be.eql(dummy);
    });
    return it('should change originator and return the instance when called with a argument', function() {
      var Dummy2, dummy2, o, r;
      Dummy2 = (function(_super) {

        __extends(Dummy2, _super);

        function Dummy2() {
          return Dummy2.__super__.constructor.apply(this, arguments);
        }

        Dummy2.prototype.createMemento = function() {
          return this.memento + this.memento;
        };

        return Dummy2;

      })(Dummy);
      dummy2 = new Dummy2();
      r = instance.originator(dummy2);
      expect(r).to.be.eql(instance);
      o = r.originator();
      expect(o).to.be.a(Dummy2);
      return expect(o).to.be.eql(dummy2);
    });
  });
  return describe('#save(memento) -> instance', function() {
    it('should return the instance', function() {
      var r;
      r = instance.save();
      expect(r).to.be.eql(instance);
      r = instance.save('HELLO');
      return expect(r).to.be.eql(instance);
    });
    it('should save new memento into `_undoStack` and change `_previous` when called without any argument', function() {
      dummy.memento = 'HELLO';
      instance.save();
      expect(instance._undoStack.length).to.be.eql(1);
      expect(instance._undoStack[0]).to.be.eql('HELLO');
      return expect(instance._previous).to.be.eql('HELLO');
    });
    it('should save specified memento into `_undoStack` and change `_previous` when called with a argument', function() {
      instance.save('HELLO');
      expect(instance._undoStack.length).to.be.eql(1);
      expect(instance._undoStack[0]).to.be.eql('HELLO');
      return expect(instance._previous).to.be.eql('HELLO');
    });
    it('should `push` a memento into `_undoStack` rather than `unshift`', function() {
      instance.save('HELLO1');
      instance.save('HELLO2');
      instance.save('HELLO3');
      expect(instance._undoStack.length).to.be.eql(3);
      return expect(instance._undoStack).to.be.eql(['HELLO1', 'HELLO2', 'HELLO3']);
    });
    it('should not save a memento which is equal with the previous one', function() {
      instance.save('HELLO');
      instance.save('HELLO');
      instance.save('HELLO');
      expect(instance._undoStack.length).to.be.eql(1);
      return expect(instance._undoStack[0]).to.be.eql('HELLO');
    });
    describe('#undo() -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.undo();
        return expect(r).to.be.eql(instance);
      });
      it('should not do anything when nothing have saved on `_undoStack`', function() {
        expect(dummy.memento).to.be.eql(null);
        expect(instance._undoStack.length).to.be.eql(0);
        expect(instance._redoStack.length).to.be.eql(0);
        expect(instance._previous).to.be.eql(null);
        instance.undo();
        expect(dummy.memento).to.be.eql(null);
        expect(instance._undoStack.length).to.be.eql(0);
        expect(instance._redoStack.length).to.be.eql(0);
        return expect(instance._previous).to.be.eql(null);
      });
      it('should pop previous memento from `_undoStack`', function() {
        var i, _j, _k, _results;
        dummy.memento = "HELLO1";
        for (i = _j = 2; _j <= 3; i = ++_j) {
          instance.save();
          dummy.memento = "HELLO" + i;
        }
        expect(instance._undoStack).to.be.eql(['HELLO1', 'HELLO2']);
        _results = [];
        for (i = _k = 3; _k >= 1; i = --_k) {
          expect(dummy.memento).to.be.eql("HELLO" + i);
          expect(instance._undoStack.length).to.be.eql(i - 1);
          _results.push(instance.undo());
        }
        return _results;
      });
      return it('should push current memento to `_redoStack`', function() {
        var i, _j, _k;
        dummy.memento = "HELLO1";
        for (i = _j = 2; _j <= 3; i = ++_j) {
          instance.save();
          dummy.memento = "HELLO" + i;
        }
        for (i = _k = 3; _k >= 1; i = --_k) {
          expect(instance._redoStack.length).to.be.eql(3 - i);
          instance.undo();
        }
        return expect(instance._redoStack).to.be.eql(['HELLO3', 'HELLO2']);
      });
    });
    describe('#redo() -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.redo();
        return expect(r).to.be.eql(instance);
      });
      it('should not do anything when nothing have saved on `_redoStack`', function() {
        expect(dummy.memento).to.be.eql(null);
        expect(instance._undoStack.length).to.be.eql(0);
        expect(instance._redoStack.length).to.be.eql(0);
        expect(instance._previous).to.be.eql(null);
        instance.redo();
        expect(dummy.memento).to.be.eql(null);
        expect(instance._undoStack.length).to.be.eql(0);
        expect(instance._redoStack.length).to.be.eql(0);
        return expect(instance._previous).to.be.eql(null);
      });
      it('should pop further memento from `_redoStack`', function() {
        var i, _j, _k, _l;
        dummy.memento = "HELLO1";
        for (i = _j = 2; _j <= 3; i = ++_j) {
          instance.save();
          dummy.memento = "HELLO" + i;
        }
        for (i = _k = 3; _k >= 1; i = --_k) {
          instance.undo();
        }
        expect(instance._redoStack).to.be.eql(['HELLO3', 'HELLO2']);
        for (i = _l = 1; _l <= 2; i = ++_l) {
          expect(dummy.memento).to.be.eql("HELLO" + i);
          expect(instance._redoStack.length).to.be.eql(3 - i);
          instance.redo();
        }
        return expect(dummy.memento).to.be.eql("HELLO3");
      });
      return it('should push current memento to `_undoStack`', function() {
        var i, _j, _k, _l;
        dummy.memento = "HELLO1";
        for (i = _j = 2; _j <= 3; i = ++_j) {
          instance.save();
          dummy.memento = "HELLO" + i;
        }
        for (i = _k = 3; _k >= 1; i = --_k) {
          instance.undo();
        }
        for (i = _l = 1; _l <= 2; i = ++_l) {
          expect(dummy.memento).to.be.eql("HELLO" + i);
          expect(instance._undoStack.length).to.be.eql(i - 1);
          instance.redo();
        }
        return expect(instance._undoStack).to.be.eql(['HELLO1', 'HELLO2']);
      });
    });
    describe('#canUndo() -> boolean', function() {
      it('should return boolean', function() {
        var r;
        r = instance.canUndo();
        return expect(r).to.be.a('boolean');
      });
      it('should return false when `_undoStack` is empty', function() {
        var r;
        r = instance.canUndo();
        return expect(r).to.be.eql(false);
      });
      return it('should return true when `_undoStack` is not empty', function() {
        var r;
        instance.save('HELLO');
        r = instance.canUndo();
        return expect(r).to.be.eql(true);
      });
    });
    return describe('#canRedo() -> boolean', function() {
      it('should return boolean', function() {
        var r;
        r = instance.canRedo();
        return expect(r).to.be.a('boolean');
      });
      it('should return false when `_redoStack` is empty', function() {
        var r;
        r = instance.canRedo();
        return expect(r).to.be.eql(false);
      });
      return it('should return true when `_redoStack` is not empty', function() {
        var r;
        instance.save('HELLO');
        instance.undo();
        r = instance.canRedo();
        return expect(r).to.be.eql(true);
      });
    });
  });
});
