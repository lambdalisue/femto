if (typeof process !== "undefined") {
    process.nextTick = (function(){
    var timeouts = []
    // postMessage behaves badly on IE8
    if (window.ActiveXObject || !window.postMessage) {
        return function(fn){
        timeouts.push(fn);
        setTimeout(function(){
            if (timeouts.length) timeouts.shift()();
        }, 0);
        }
    }

    // based on setZeroTimeout by David Baron
    // - http://dbaron.org/log/20100309-faster-timeouts
    var name = 'mocha-zero-timeout'

    window.addEventListener('message', function(e){
        if (e.source == window && e.data == name) {
        if (e.stopPropagation) e.stopPropagation();
        if (timeouts.length) timeouts.shift()();
        }
    }, true);

    return function(fn){
        timeouts.push(fn);
        window.postMessage(name, '*');
    }
    })();
}

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe('Femto.transform(textarea, options) -> instance', function() {
    var instance, textarea;
    instance = textarea = null;
    before(function() {
      textarea = document.createElement('textarea');
      return instance = Femto.transform(textarea);
    });
    return describe('@returning value', function() {
      it('should have `femto` property', function() {
        return expect(instance).to.have.property('femto');
      });
      return describe('#femto', function() {
        var method, methods, properties, property, _i, _j, _len, _len1, _results;
        properties = [['originator', Femto.utils.Originator], ['caretaker', Femto.utils.Caretaker], ['indent', Femto.utils.Indent], ['caret', Femto.utils.Caret], ['linecaret', Femto.utils.LineCaret]];
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          property = properties[_i];
          it("should have `" + property[0] + "` property", function() {
            expect(instance.femto).to.have.property(property[0]);
            if (property[1]) {
              return expect(instance.femto[property[0]]).to.be.a(property[1]);
            }
          });
        }
        methods = ['enable', 'disable'];
        _results = [];
        for (_j = 0, _len1 = methods.length; _j < _len1; _j++) {
          method = methods[_j];
          _results.push(it("should have `" + method + "` method", function() {
            expect(instance.femto).to.have.property(method);
            return expect(instance.femto[method]).to.be.a('function');
          }));
        }
        return _results;
      });
    });
  });

  describe('Femto.utils.Caret', function() {
    var Caret, expected_methods, expected_private_methods, instance, isIE, method, normalizedValue, rollback, textarea, _fn, _fn1, _i, _j, _len, _len1;
    Caret = Femto.utils.Caret;
    textarea = instance = null;
    isIE = document.selection != null;
    normalizedValue = function() {
      return textarea.value.replace(/\r\n/g, '\n');
    };
    rollback = function() {
      return textarea.value = 'aaaa\nbbbb\ncccc\n';
    };
    before(function() {
      textarea = document.createElement('textarea');
      rollback();
      instance = new Caret(textarea);
      document.body.appendChild(textarea);
      return textarea.focus();
    });
    after(function() {
      return document.body.removeChild(textarea);
    });
    afterEach(function() {
      return rollback();
    });
    expected_private_methods = ['_replace'];
    _fn = function(method) {
      return it("instance should have private `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_i = 0, _len = expected_private_methods.length; _i < _len; _i++) {
      method = expected_private_methods[_i];
      _fn(method);
    }
    expected_methods = ['get', 'set', 'text', 'isCollapsed', 'collapse', 'insertBefore', 'insertAfter', 'enclose'];
    _fn1 = function(method) {
      return it("instance should have public `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_j = 0, _len1 = expected_methods.length; _j < _len1; _j++) {
      method = expected_methods[_j];
      _fn1(method);
    }
    describe('#get() -> [s, e]', function() {
      it('should return current caret position as a list', function() {
        var caret;
        instance.set(0, 0);
        caret = instance.get();
        expect(caret).to.be.a('array');
        return expect(caret).to.be.eql([0, 0]);
      });
      it('should return [2, 2] when caret set to', function() {
        var caret;
        instance.set(2, 2);
        caret = instance.get();
        return expect(caret).to.be.eql([2, 2]);
      });
      it('should return [2, 4] when caret set to', function() {
        var caret;
        instance.set(2, 4);
        caret = instance.get();
        return expect(caret).to.be.eql([2, 4]);
      });
      it('should return [4, 4] (before Newline) when caret set to', function() {
        var caret;
        instance.set(4, 4);
        caret = instance.get();
        return expect(caret).to.be.eql([4, 4]);
      });
      it('should return [5, 5] (after Newline) when caret set to', function() {
        var caret;
        instance.set(5, 5);
        caret = instance.get();
        return expect(caret).to.be.eql([5, 5]);
      });
      it('should return [6, 6] (two char after from Newline) ' + 'when caret set to', function() {
        var caret;
        instance.set(6, 6);
        caret = instance.get();
        return expect(caret).to.be.eql([6, 6]);
      });
      it('should return [10, 10] (before 2nd Newline) when caret set to', function() {
        var caret;
        instance.set(10, 10);
        caret = instance.get();
        return expect(caret).to.be.eql([10, 10]);
      });
      it('should return [11, 11] (after 2nd Newline) when caret set to', function() {
        var caret;
        instance.set(11, 11);
        caret = instance.get();
        return expect(caret).to.be.eql([11, 11]);
      });
      it('should return [4, 5] (Newline) when caret set to', function() {
        var caret;
        instance.set(4, 5);
        caret = instance.get();
        return expect(caret).to.be.eql([4, 5]);
      });
      it('should return [2, 7] (include Newline) when caret set to', function() {
        var caret;
        instance.set(2, 7);
        caret = instance.get();
        return expect(caret).to.be.eql([2, 7]);
      });
      return it('should return [2, 12] (include two Newlines) when caret set to', function() {
        var caret;
        instance.set(2, 12);
        caret = instance.get();
        return expect(caret).to.be.eql([2, 12]);
      });
    });
    describe('#set(s, e) -> instance', function() {
      it('should return the instance', function() {
        var result;
        result = instance.set(0, 0);
        expect(result).to.be.a(Caret);
        expect(result).to.be.eql(instance);
        result = instance.set(0);
        expect(result).to.be.a(Caret);
        return expect(result).to.be.eql(instance);
      });
      it('should change caret position to specified when called ' + 'with two arguments', function() {
        var caret;
        caret = instance.set(1, 2).get();
        return expect(caret).to.be.eql([1, 2]);
      });
      return it('should change caret position with specified offset when ' + 'called with one argument', function() {
        var ncaret, pcaret;
        pcaret = instance.set(0, 0).get();
        ncaret = instance.set(5).get();
        return expect(ncaret).to.be.eql([pcaret[0] + 5, pcaret[1] + 5]);
      });
    });
    describe('#isCollapsed() -> boolean', function() {
      it('should return true when the start and end points of the ' + 'selection are the same', function() {
        instance.set(0, 0);
        expect(instance.isCollapsed()).to.be["true"];
        instance.set(5, 5);
        return expect(instance.isCollapsed()).to.be["true"];
      });
      return it('should return false when the start and end points of the ' + 'selection are not the same', function() {
        instance.set(0, 1);
        expect(instance.isCollapsed()).to.be["false"];
        instance.set(5, 6);
        return expect(instance.isCollapsed()).to.be["true"];
      });
    });
    describe('#collapse(toStart) -> instance', function() {
      it('should moves the start point of the selection to its end ' + 'point and return the instance when called without argument', function() {
        var e, r, s, _ref;
        instance.set(0, 7);
        r = instance.collapse();
        _ref = instance.get(), s = _ref[0], e = _ref[1];
        expect(r).to.be.a(Caret);
        expect(r).to.be.eql(instance);
        return expect([s, e]).to.be.eql([7, 7]);
      });
      return it('should moves the end point of the selection to its start ' + 'point and return the instance when called with argument (True)', function() {
        var e, r, s, _ref;
        instance.set(0, 7);
        r = instance.collapse(true);
        _ref = instance.get(), s = _ref[0], e = _ref[1];
        expect(r).to.be.a(Caret);
        expect(r).to.be.eql(instance);
        return expect([s, e]).to.be.eql([0, 0]);
      });
    });
    describe('#text(text, keepSelection) -> string | instance', function() {
      it('should return current selected text when called without ' + 'any arguments', function() {
        var text;
        instance.set(0, 0);
        text = instance.text();
        expect(text).to.be.a('string');
        expect(text).to.be.eql('');
        instance.set(3, 7);
        text = instance.text();
        return expect(text).to.be.eql("a\nbb");
      });
      it('should return the instance when called with arguments', function() {
        var result;
        instance.set(0, 0);
        result = instance.text('HELLO');
        expect(result).to.be.a(Caret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.text('HELLO', true);
        expect(result).to.be.a(Caret);
        return expect(result).to.be.eql(instance);
      });
      it('should insert text before the caret when no text is ' + 'selected and called with one argument', function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.text("HELLO");
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([5, 5]);
      });
      it('should insert text before the caret and select insertion ' + 'when no text is selected and called with two arguments', function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.text("HELLO", true);
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([0, 5]);
      });
      it('should replace text of selected when text is selected and ' + 'called with one argument', function() {
        var caret, result;
        instance.set(2, 11);
        result = instance.text("HELLO");
        expect(normalizedValue()).to.be.eql("aaHELLOccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([7, 7]);
      });
      return it('should replace text of selected and select replacement when ' + 'text is selected and called with two arguments', function() {
        var caret, result;
        instance.set(2, 11);
        result = instance.text("HELLO", true);
        expect(normalizedValue()).to.be.eql("aaHELLOccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([2, 7]);
      });
    });
    describe("#insertBefore(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.set(0, 0);
        result = instance.insertBefore("HELLO");
        expect(result).to.be.a(Caret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.insertBefore("HELLO", true);
        expect(result).to.be.a(Caret);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text before the caret when no text is " + "selected and called with one argument", function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.insertBefore("HELLO");
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([5, 5]);
      });
      it("should insert text before the caret and select insertion " + "when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.insertBefore("HELLO", true);
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text before the selection when text is selected " + "and called with one argument", function() {
        var caret, result;
        instance.set(2, 4);
        result = instance.insertBefore("HELLO");
        expect(normalizedValue()).to.be.eql("aaHELLOaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([7, 7]);
      });
      return it("should insert text before the selection and select insertion " + "when text is selected and called with two arguments", function() {
        var caret, result;
        instance.set(2, 4);
        result = instance.insertBefore("HELLO", true);
        expect(normalizedValue()).to.be.eql("aaHELLOaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([2, 7]);
      });
    });
    describe("#insertAfter(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.set(0, 0);
        result = instance.insertAfter("HELLO");
        expect(result).to.be.a(Caret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.insertAfter("HELLO", true);
        expect(result).to.be.a(Caret);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text after the caret when no text is selected " + "and called with one argument", function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.insertAfter("HELLO");
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([5, 5]);
      });
      it("should insert text after the caret and select insertion when " + "no text is selected and called with two arguments", function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.insertAfter("HELLO", true);
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text after the selection when text is selected " + "and called with one argument", function() {
        var caret, result;
        instance.set(1, 3);
        result = instance.insertAfter("HELLO");
        expect(normalizedValue()).to.be.eql("aaaHELLOa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([8, 8]);
      });
      return it("should insert text after the selection and select insertion when " + "text is selected and called with two arguments", function() {
        var caret, result;
        instance.set(1, 3);
        result = instance.insertAfter("HELLO", true);
        expect(normalizedValue()).to.be.eql("aaaHELLOa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([3, 8]);
      });
    });
    return describe("#enclose(lhs, rhs, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.set(0, 0);
        result = instance.enclose("HELLO", "WORLD");
        expect(result).to.be.a(Caret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.enclose("HELLO", "WORLD", true);
        expect(result).to.be.a(Caret);
        return expect(result).to.be.eql(instance);
      });
      it("should insert both text before the caret when no text is " + "selected and called with two arguments", function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("HELLOWORLDaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([10, 10]);
      });
      it("should insert both text before the caret and select insertion " + "when no text is selected and called with three arguments", function() {
        var caret, result;
        instance.set(0, 0);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(normalizedValue()).to.be.eql("HELLOWORLDaaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([0, 10]);
      });
      it("should enclose the selection with specified when text is " + "selected and called with two arguments", function() {
        var caret, result;
        instance.set(1, 3);
        result = instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("aHELLOaaWORLDa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([13, 13]);
      });
      it("should enclose the selection with specified and select text include " + "insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.set(1, 3);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(normalizedValue()).to.be.eql("aHELLOaaWORLDa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([1, 13]);
      });
      it("should remove specified when selected text (or caret) is " + "enclosed and called with two arguments", function() {
        var caret;
        instance.set(0, 0);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        caret = instance.get();
        expect(caret).to.be.eql([0, 0]);
        instance.set(2, 7);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([7, 7]);
      });
      return it("should remove specified and select text when selected " + "text (or caret) is enclosed and called with three arguments", function() {
        var caret;
        instance.set(2, 7);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD", true);
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        caret = instance.get();
        return expect(caret).to.be.eql([2, 7]);
      });
    });
  });

  describe('Femto.utils.clone', function() {
    var DEFAULT, clone;
    clone = Femto.utils.clone;
    DEFAULT = {
      'a': 'a',
      'b': 'b',
      'c': 'c'
    };
    it('should return new object', function() {
      var cloned, cloned2;
      cloned = clone(DEFAULT);
      cloned2 = cloned;
      cloned['a'] = 1;
      cloned['b'] = 2;
      cloned['c'] = 3;
      expect(cloned2['a']).to.be.eql(1);
      expect(cloned2['b']).to.be.eql(2);
      expect(cloned2['c']).to.be.eql(3);
      expect(DEFAULT['a']).to.be.eql('a');
      expect(DEFAULT['b']).to.be.eql('b');
      return expect(DEFAULT['c']).to.be.eql('c');
    });
    return it('should return object which has exactly same properties', function() {
      var cloned, k, v, _results;
      cloned = clone(DEFAULT);
      _results = [];
      for (k in DEFAULT) {
        v = DEFAULT[k];
        _results.push(expect(cloned[k]).to.be.eql(v));
      }
      return _results;
    });
  });

  describe('Femto.utils.extend', function() {
    var DEFAULT, extend;
    extend = Femto.utils.extend;
    DEFAULT = {
      'a': 'a',
      'b': 'b',
      'c': 'c'
    };
    it('should return default when nothing is specified', function() {
      var k, options, v, _results;
      options = extend({}, DEFAULT);
      _results = [];
      for (k in DEFAULT) {
        v = DEFAULT[k];
        _results.push(expect(options[k]).to.be.eql(v));
      }
      return _results;
    });
    return it('should overwrite default when values are specified', function() {
      var SPECIFIED, k, options, v, _results;
      SPECIFIED = {
        'a': 1,
        'b': 2,
        'c': 3
      };
      options = extend(SPECIFIED, DEFAULT);
      _results = [];
      for (k in SPECIFIED) {
        v = SPECIFIED[k];
        _results.push(expect(options[k]).to.be.eql(v));
      }
      return _results;
    });
  });

  describe('Femto.utils.Indent', function() {
    var Caret, Indent, caret, expected_methods, expected_private_methods, expected_private_properties, expected_properties, instance, isIE, method, name, normalizedValue, rollback, textarea, type, value, _fn, _fn1, _fn2, _fn3, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    textarea = instance = caret = value = null;
    Indent = Femto.utils.Indent;
    Caret = Femto.utils.Caret;
    isIE = document.caret != null;
    normalizedValue = function() {
      return textarea.value.replace(/\r\n/g, '\n');
    };
    rollback = function() {
      return textarea.value = 'aaaa\nbbbb\ncccc\n';
    };
    before(function() {
      textarea = document.createElement('textarea');
      rollback();
      instance = new Indent(textarea);
      document.body.appendChild(textarea);
      return textarea.focus();
    });
    after(function() {
      return document.body.removeChild(textarea);
    });
    afterEach(function() {
      return rollback();
    });
    expected_private_properties = [['_newlinep', RegExp], ['_leadingp', RegExp]];
    _fn = function(name, type) {
      return it("instance should have private `" + name + "` property", function() {
        expect(instance).to.have.property(name);
        if (type != null) {
          return expect(instance[name]).to.be.a(type);
        }
      });
    };
    for (_i = 0, _len = expected_private_properties.length; _i < _len; _i++) {
      _ref = expected_private_properties[_i], name = _ref[0], type = _ref[1];
      _fn(name, type);
    }
    expected_properties = [['caret', Caret], ['textarea', null], ['options', 'object']];
    _fn1 = function(name, type) {
      return it("instance should have public `" + name + "` property", function() {
        expect(instance).to.have.property(name);
        if (type != null) {
          return expect(instance[name]).to.be.a(type);
        }
      });
    };
    for (_j = 0, _len1 = expected_properties.length; _j < _len1; _j++) {
      _ref1 = expected_properties[_j], name = _ref1[0], type = _ref1[1];
      _fn1(name, type);
    }
    expected_private_methods = ['_makeTabString', '_keyDownEvent'];
    _fn2 = function(method) {
      return it("instance should have private `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_k = 0, _len2 = expected_private_methods.length; _k < _len2; _k++) {
      method = expected_private_methods[_k];
      _fn2(method);
    }
    expected_methods = ['indent', 'outdent', 'insertNewLine', 'enable', 'disable'];
    _fn3 = function(method) {
      return it("instance should have public `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_l = 0, _len3 = expected_methods.length; _l < _len3; _l++) {
      method = expected_methods[_l];
      _fn3(method);
    }
    describe('#indent() -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.indent();
        expect(r).to.be.a(Indent);
        return expect(r).to.be.eql(instance);
      });
      it('should insert 4 spaces before the caret [0, 0] and move ' + 'the caret to [4, 4], [8, 8]', function() {
        instance.caret.set(0, 0);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([4, 4]);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("        aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([8, 8]);
      });
      it('should insert 2, 4 spaces before the caret [2, 2] and move ' + 'the caret to [4, 4], [8, 8]', function() {
        instance.caret.set(2, 2);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aa  aa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([4, 4]);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aa      aa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([8, 8]);
      });
      it('should insert 4 spaces before the caret [4, 4] ' + '(before Newline) and move the caret to [8, 8]', function() {
        instance.caret.set(4, 4);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa    \nbbbb\ncccc\n");
        return expect(caret).to.be.eql([8, 8]);
      });
      it('should insert 4 spaces before the caret [5, 5] ' + '(after Newline) and move the caret to [9, 9]', function() {
        instance.caret.set(5, 5);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\n    bbbb\ncccc\n");
        return expect(caret).to.be.eql([9, 9]);
      });
      it('should insert 4 spaces before the single line caret [0, 4] ' + 'and move the caret to [4, 8], [8, 12]', function() {
        instance.caret.set(0, 4);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([4, 8]);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("        aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([8, 12]);
      });
      it('should insert 3, 4 spaces before the caret within a single ' + 'line [1, 3] and move the caret to [4, 6], [8, 10]', function() {
        instance.caret.set(1, 3);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("a   aaa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([4, 6]);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("a       aaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([8, 10]);
      });
      it('should insert 4 spaces before each selected lines [0, 9] ' + 'and move the caret to [0, 17], [0, 25]', function() {
        instance.caret.set(0, 9);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n");
        expect(caret).to.be.eql([0, 17]);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("        aaaa\n        bbbb\ncccc\n");
        return expect(caret).to.be.eql([0, 25]);
      });
      it('should insert 4 spaces before each lines contains the caret ' + '[2, 7] and move the caret to [6, 15], [10, 23]', function() {
        instance.caret.set(2, 7);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n");
        expect(caret).to.be.eql([6, 15]);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("        aaaa\n        bbbb\ncccc\n");
        return expect(caret).to.be.eql([10, 23]);
      });
      it('should insert appropriate number of spaces before each selected ' + 'lines and move the caret to [0, 26]', function() {
        textarea.value = " aaaa\n  bbbb\n   cccc\n";
        instance.caret.set(0, 20);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\n    cccc\n");
        return expect(caret).to.be.eql([0, 26]);
      });
      return it('should insert appropriate number of spaces before each ' + 'lines contains caret and move the caret to [6, 24]', function() {
        textarea.value = " aaaa\n  bbbb\n   cccc\n";
        instance.caret.set(3, 18);
        instance.indent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\n    cccc\n");
        return expect(caret).to.be.eql([6, 24]);
      });
    });
    describe('#outdent() -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.outdent();
        expect(r).to.be.a(Indent);
        return expect(r).to.be.eql(instance);
      });
      it('should remove 4 spaces before the caret [8, 8] and move ' + 'the caret to [4, 4], [0, 0]', function() {
        textarea.value = "        aaaa\nbbbb\ncccc\n";
        instance.caret.set(8, 8);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([4, 4]);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([0, 0]);
      });
      it('should remove 2, 4 spaces before the caret [6, 6] and ' + 'move the caret to [2, 2], [0, 0]', function() {
        textarea.value = "      aaaa\nbbbb\ncccc\n";
        instance.caret.set(6, 6);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([4, 4]);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([0, 0]);
      });
      it('should remove 4 spaces before the caret [8, 8] (before Newline) ' + 'and move the caret to [4, 4]', function() {
        textarea.value = "aaaa    \nbbbb\ncccc\n";
        instance.caret.set(8, 8);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([4, 4]);
      });
      it('should remove 4 spaces before the caret [9, 9] (after Newline) ' + 'and move the caret to [5, 5]', function() {
        textarea.value = "aaaa\n    bbbb\ncccc\n";
        instance.caret.set(9, 9);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([5, 5]);
      });
      it('should remove 4 spaces before the single line caret [8, 12] ' + 'and move the caret to [4, 8], [0, 4]', function() {
        textarea.value = "        aaaa\nbbbb\ncccc\n";
        instance.caret.set(8, 12);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([4, 8]);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([0, 4]);
      });
      it('should remove 3, 4 spaces before the single line caret [5, 9] ' + 'and move the caret to [1, 5], [0, 1]', function() {
        textarea.value = "        aaaa\nbbbb\ncccc\n";
        instance.caret.set(5, 9);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\nbbbb\ncccc\n");
        expect(caret).to.be.eql([1, 5]);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([0, 1]);
      });
      it('should remove 4 spaces before each selected lines [0, 25] and ' + 'move the caret to [0, 17], [0, 9]', function() {
        textarea.value = "        aaaa\n        bbbb\ncccc\n";
        instance.caret.set(0, 25);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n");
        expect(caret).to.be.eql([0, 17]);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([0, 9]);
      });
      return it('should remove 2, 4 spaces before each lines contains [0, 29] and ' + 'move the caret to [0, 25], [0, 17], [0, 9]', function() {
        textarea.value = "          aaaa\n          bbbb\ncccc\n";
        instance.caret.set(0, 29);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("        aaaa\n        bbbb\ncccc\n");
        expect(caret).to.be.eql([0, 25]);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n    bbbb\ncccc\n");
        expect(caret).to.be.eql([0, 17]);
        instance.outdent();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([0, 9]);
      });
    });
    describe('#insertNewLine() -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.insertNewLine();
        expect(r).to.be.a(Indent);
        return expect(r).to.be.eql(instance);
      });
      it('should insert newline after the caret [0, 0] and move ' + 'the caret to [1, 1]', function() {
        instance.caret.set(0, 0);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("\naaaa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([1, 1]);
      });
      it('should insert newline after the caret [2, 2] and ' + 'move the caret to [3, 3]', function() {
        instance.caret.set(2, 2);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aa\naa\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([3, 3]);
      });
      it('should insert newline after the caret [4, 4] and ' + 'move the caret to [5, 5]', function() {
        instance.caret.set(4, 4);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\n\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([5, 5]);
      });
      it('should insert newline after the caret [5, 5] and move ' + 'the caret to [6, 6]', function() {
        instance.caret.set(5, 5);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\n\nbbbb\ncccc\n");
        return expect(caret).to.be.eql([6, 6]);
      });
      it('should insert newline after the caret [7, 7] and move ' + 'the caret to [8, 8]', function() {
        instance.caret.set(7, 7);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbb\nbb\ncccc\n");
        return expect(caret).to.be.eql([8, 8]);
      });
      it('should insert newline after the caret [14, 14] and move ' + 'the caret to [15, 15]', function() {
        instance.caret.set(14, 14);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n\n");
        return expect(caret).to.be.eql([15, 15]);
      });
      it('should insert newline after the caret [15, 15] and move ' + 'the caret to [16, 16]', function() {
        instance.caret.set(15, 15);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n\n");
        return expect(caret).to.be.eql([16, 16]);
      });
      it('should insert newline after the caret [2, 7] and move the ' + 'caret to [2, 8]', function() {
        instance.caret.set(2, 7);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("aaaa\nbb\nbb\ncccc\n");
        return expect(caret).to.be.eql([2, 8]);
      });
      it('should insert newline with tabString after the caret [4, 4] ' + 'and move the caret to [9, 9]', function() {
        textarea.value = "    aaaa\n  bbbb\ncccc\n";
        instance.caret.set(4, 4);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    \n    aaaa\n  bbbb\ncccc\n");
        return expect(caret).to.be.eql([9, 9]);
      });
      it('should insert newline with tabString after the caret [6, 6] ' + 'and move the caret to [11, 11]', function() {
        textarea.value = "    aaaa\n  bbbb\ncccc\n";
        instance.caret.set(6, 6);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aa\n    aa\n  bbbb\ncccc\n");
        return expect(caret).to.be.eql([11, 11]);
      });
      it('should insert newline with tabString after the caret [8, 8] and ' + 'move the caret to [13, 13]', function() {
        textarea.value = "    aaaa\n  bbbb\ncccc\n";
        instance.caret.set(8, 8);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n    \n  bbbb\ncccc\n");
        return expect(caret).to.be.eql([13, 13]);
      });
      it('should insert newline after the caret [9, 9] and move the ' + 'caret to [10, 10]', function() {
        textarea.value = "    aaaa\n  bbbb\ncccc\n";
        instance.caret.set(9, 9);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("    aaaa\n\n  bbbb\ncccc\n");
        return expect(caret).to.be.eql([10, 10]);
      });
      it('should insert newline after the caret [2, 10] and move the ' + 'caret to [2, 19]', function() {
        textarea.value = "        aaaa\n    bbbb\ncccc\n";
        instance.caret.set(2, 10);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("        aa\n        aa\n    bbbb\ncccc\n");
        return expect(caret).to.be.eql([2, 19]);
      });
      return it('should insert newline after the caret [2, 19] and move ' + 'the caret to [2, 24]', function() {
        textarea.value = "        aaaa\n    bbbb\ncccc\n";
        instance.caret.set(2, 19);
        instance.insertNewLine();
        caret = instance.caret.get();
        expect(normalizedValue()).to.be.eql("        aaaa\n    bb\n    bb\ncccc\n");
        return expect(caret).to.be.eql([2, 24]);
      });
    });
    return describe('!KeyDown event', function() {
      it('should call `indent()` when user hit TAB', function() {
        var e, indent;
        e = jQuery.Event('keydown', {
          which: 9
        });
        indent = instance.indent;
        instance.indent = function() {
          return this.indent.called = true;
        };
        instance.indent.called = false;
        $(textarea).trigger(e);
        expect(instance.indent.called).to.be["true"];
        return instance.indent = indent;
      });
      it('should call `outdent()` when user hit Shift+TAB', function() {
        var e, outdent;
        e = jQuery.Event('keydown', {
          which: 9,
          shiftKey: true
        });
        outdent = instance.outdent;
        instance.outdent = function() {
          return this.outdent.called = true;
        };
        instance.outdent.called = false;
        $(textarea).trigger(e);
        expect(instance.outdent.called).to.be["true"];
        return instance.outdent = outdent;
      });
      it('should call `insertNewLine()` when user hit RETURN', function() {
        var e, insertNewLine;
        e = jQuery.Event('keydown', {
          which: 13
        });
        insertNewLine = instance.insertNewLine;
        instance.insertNewLine = function() {
          return this.insertNewLine.called = true;
        };
        instance.insertNewLine.called = false;
        $(textarea).trigger(e);
        expect(instance.insertNewLine.called).to.be["true"];
        return instance.insertNewLine = insertNewLine;
      });
      return it('should NOT call `insertNewLine()` when user hit Shift+RETURN', function() {
        var e, insertNewLine;
        e = jQuery.Event('keydown', {
          which: 13,
          shiftKey: true
        });
        insertNewLine = instance.insertNewLine;
        instance.insertNewLine = function() {
          return this.insertNewLine.called = true;
        };
        instance.insertNewLine.called = false;
        instance.caret.set(0, 0);
        $(textarea).trigger(e);
        expect(instance.insertNewLine.called).to.be["false"];
        return instance.insertNewLine = insertNewLine;
      });
    });
  });

  describe('Femto.utils.LineCaret', function() {
    var Caret, LineCaret, caret, expected_methods, expected_private_methods, instance, isIE, method, normalizedValue, rollback, textarea, _fn, _fn1, _i, _j, _len, _len1;
    Caret = Femto.utils.Caret;
    LineCaret = Femto.utils.LineCaret;
    textarea = instance = caret = null;
    isIE = document.selection != null;
    normalizedValue = function() {
      return textarea.value.replace(/\r\n/g, '\n');
    };
    rollback = function() {
      return textarea.value = 'aaaa\nbbbb\ncccc\n';
    };
    before(function() {
      textarea = document.createElement('textarea');
      rollback();
      caret = new Caret(textarea);
      instance = new LineCaret(textarea);
      document.body.appendChild(textarea);
      return textarea.focus();
    });
    after(function() {
      return document.body.removeChild(textarea);
    });
    afterEach(function() {
      return rollback();
    });
    expected_private_methods = ['_replace'];
    _fn = function(method) {
      return it("instance should have private `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_i = 0, _len = expected_private_methods.length; _i < _len; _i++) {
      method = expected_private_methods[_i];
      _fn(method);
    }
    expected_methods = ['get', 'set', 'text', 'isCollapsed', 'collapse', 'insertBefore', 'insertAfter', 'enclose'];
    _fn1 = function(method) {
      return it("instance should have public `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_j = 0, _len1 = expected_methods.length; _j < _len1; _j++) {
      method = expected_methods[_j];
      _fn1(method);
    }
    describe("#get() -> [s, e]", function() {
      it("should return current line caret position as a list", function() {
        var lcaret;
        caret.set(2, 2);
        lcaret = instance.get();
        expect(lcaret).to.be.a("array");
        expect(lcaret).to.be.eql([0, 4]);
        caret.set(6, 11);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([5, 14]);
      });
      it("should return specified line caret position as a list", function() {
        var lcaret;
        caret.set(0, 0);
        lcaret = instance.get(2, 2);
        expect(lcaret).to.be.a("array");
        expect(lcaret).to.be.eql([0, 4]);
        return expect(caret.get()).to.be.eql([0, 0]);
      });
      it('should return line caret [0, 4] for caret [2, 2]', function() {
        var lcaret;
        caret.set(2, 2);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([0, 4]);
      });
      it('should return line caret [0, 4] for caret [1, 3]', function() {
        var lcaret;
        caret.set(1, 3);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([0, 4]);
      });
      it('should return line caret [0, 4] for caret [0, 4]', function() {
        var lcaret;
        caret.set(0, 4);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([0, 4]);
      });
      it('should return line caret [5, 9] for caret [7, 7]', function() {
        var lcaret;
        caret.set(7, 7);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([5, 9]);
      });
      it('should return line caret [5, 9] for caret [6, 8]', function() {
        var lcaret;
        caret.set(6, 8);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([5, 9]);
      });
      it('should return line caret [5, 9] for caret [5, 9]', function() {
        var lcaret;
        caret.set(5, 9);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([5, 9]);
      });
      it('should return line caret [0, 9] for caret [2, 7]', function() {
        var lcaret;
        caret.set(2, 7);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([0, 9]);
      });
      it('should return line caret [0, 9] for caret [0, 9]', function() {
        var lcaret;
        caret.set(0, 9);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([0, 9]);
      });
      it('should return line caret [0, 9] for caret [0, 5]', function() {
        var lcaret;
        caret.set(0, 5);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([0, 9]);
      });
      return it('should return line caret [0, 14] for caret [0, 10]', function() {
        var lcaret;
        caret.set(0, 10);
        lcaret = instance.get();
        return expect(lcaret).to.be.eql([0, 14]);
      });
    });
    describe("#text(text, keepLineCaret) -> string | instance", function() {
      it("should return current selected line text when " + "called without any arguments", function() {
        var text;
        caret.set(0, 0);
        text = instance.text();
        expect(text).to.be.a("string");
        expect(text).to.be.eql("aaaa");
        caret.set(2, 7);
        text = instance.text();
        return expect(text).to.be.eql("aaaa\nbbbb");
      });
      it("should return the instance when called with arguments", function() {
        var result;
        caret.set(0, 0);
        result = instance.text("HELLO");
        expect(result).to.be.a(LineCaret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.text("HELLO", true);
        expect(result).to.be.a(LineCaret);
        return expect(result).to.be.eql(instance);
      });
      it("should replace single line of caret position when no text is " + "selected and called with one argument", function() {
        var lcaret, result;
        caret.set(0, 0);
        result = instance.text("HELLO");
        expect(normalizedValue()).to.be.eql("HELLO\nbbbb\ncccc\n");
        lcaret = caret.get();
        expect(lcaret).to.be.eql([5, 5]);
        rollback();
        caret.set(7, 7);
        result = instance.text("HELLO");
        expect(normalizedValue()).to.be.eql("aaaa\nHELLO\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([10, 10]);
      });
      it("should replace single line of caret position and select " + "insertion when no text is selected and called with two arguments", function() {
        var lcaret, result;
        caret.set(0, 0);
        result = instance.text("HELLO", true);
        expect(normalizedValue()).to.be.eql("HELLO\nbbbb\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([0, 5]);
      });
      it("should replace lines of selection when text is selected " + "and called with one argument", function() {
        var lcaret, result;
        caret.set(2, 8);
        result = instance.text("HELLO");
        expect(normalizedValue()).to.be.eql("HELLO\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([5, 5]);
      });
      return it("should replace lines of selection and select replacement when " + "text is selected and called with two arguments", function() {
        var lcaret, result;
        caret.set(2, 8);
        result = instance.text("HELLO", true);
        expect(normalizedValue()).to.be.eql("HELLO\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([0, 5]);
      });
    });
    describe("#insertBefore(text, keepLineCaret) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        caret.set(0, 0);
        result = instance.insertBefore("HELLO");
        expect(result).to.be.a(LineCaret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.insertBefore("HELLO", true);
        expect(result).to.be.a(LineCaret);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text before the current line when no " + "text is selected and called with one argument", function() {
        var lcaret, result;
        caret.set(7, 7);
        result = instance.insertBefore("HELLO");
        expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([10, 10]);
      });
      it("should insert text before the current line and select " + "insertion when no text is selected and called with two arguments", function() {
        var lcaret, result;
        caret.set(7, 7);
        result = instance.insertBefore("HELLO", true);
        expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([5, 10]);
      });
      it("should insert text before the line of the selection when " + "text is selected and called with one argument", function() {
        var lcaret, result;
        caret.set(7, 13);
        result = instance.insertBefore("HELLO");
        expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([10, 10]);
      });
      return it("should insert text before the line of the selection and select " + "insertion when text is selected and called with two arguments", function() {
        var lcaret, result;
        caret.set(7, 13);
        result = instance.insertBefore("HELLO", true);
        expect(normalizedValue()).to.be.eql("aaaa\nHELLObbbb\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([5, 10]);
      });
    });
    describe("#insertAfter(text, keepLineCaret) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        caret.set(0, 0);
        result = instance.insertAfter("HELLO");
        expect(result).to.be.a(LineCaret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.insertAfter("HELLO", true);
        expect(result).to.be.a(LineCaret);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text after the current line when no text is " + "selected and called with one argument", function() {
        var lcaret, result;
        caret.set(7, 7);
        result = instance.insertAfter("HELLO");
        expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([14, 14]);
      });
      it("should insert text after the current line and select insertion " + "when no text is selected and called with two arguments", function() {
        var lcaret, result;
        caret.set(7, 7);
        result = instance.insertAfter("HELLO", true);
        expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([9, 14]);
      });
      it("should insert text after the line of the selection when text is " + "selected and called with one argument", function() {
        var lcaret, result;
        caret.set(2, 7);
        result = instance.insertAfter("HELLO");
        expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([14, 14]);
      });
      return it("should insert text after the line of the selection and select " + "insertion when text is selected and called with two arguments", function() {
        var lcaret, result;
        caret.set(2, 7);
        result = instance.insertAfter("HELLO", true);
        expect(normalizedValue()).to.be.eql("aaaa\nbbbbHELLO\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([9, 14]);
      });
    });
    return describe("#enclose(lhs, rhs, keepLineCaret) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        caret.set(0, 0);
        result = instance.enclose("HELLO", "WORLD");
        expect(result).to.be.a(LineCaret);
        expect(result).to.be.eql(instance);
        rollback();
        result = instance.enclose("HELLO", "WORLD", true);
        expect(result).to.be.a(LineCaret);
        return expect(result).to.be.eql(instance);
      });
      it("should enclose the line of the selection with specified when text " + "is selected and called with two arguments", function() {
        var lcaret, result;
        caret.set(2, 2);
        result = instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("HELLOaaaaWORLD\nbbbb\ncccc\n");
        lcaret = caret.get();
        expect(lcaret).to.be.eql([14, 14]);
        rollback();
        caret.set(2, 6);
        result = instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbbWORLD\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([19, 19]);
      });
      it("should enclose the line of the selection with specified and select " + "text include insertion when text is selected and called with two " + "arguments", function() {
        var lcaret, result;
        caret.set(2, 2);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(normalizedValue()).to.be.eql("HELLOaaaaWORLD\nbbbb\ncccc\n");
        lcaret = caret.get();
        expect(lcaret).to.be.eql([0, 14]);
        rollback();
        caret.set(2, 6);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(normalizedValue()).to.be.eql("HELLOaaaa\nbbbbWORLD\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([0, 19]);
      });
      it("should remove specified when selected text (or caret) is enclosed " + "and called with two arguments", function() {
        var lcaret;
        caret.set(2, 2);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        lcaret = caret.get();
        expect(lcaret).to.be.eql([4, 4]);
        caret.set(2, 6);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([9, 9]);
      });
      return it("should remove specified and select text when selected text " + "(or caret) is enclosed and called with three arguments", function() {
        var lcaret;
        caret.set(2, 6);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD", true);
        expect(normalizedValue()).to.be.eql("aaaa\nbbbb\ncccc\n");
        lcaret = caret.get();
        return expect(lcaret).to.be.eql([0, 9]);
      });
    });
  });

  describe('Femto.utils.typeOf', function() {
    var typeOf;
    typeOf = Femto.utils.typeOf;
    it('should return "null" for null', function() {
      var r;
      r = typeOf(null);
      return expect(r).to.be.eql("null");
    });
    it('should return "undefined" for undefined', function() {
      var r;
      r = typeOf(void 0);
      return expect(r).to.be.eql("undefined");
    });
    it('should return "array" for `[]`', function() {
      var r;
      r = typeOf([]);
      return expect(r).to.be.eql("array");
    });
    it('should return "array" for `new Array()`', function() {
      var r;
      r = typeOf(new Array());
      return expect(r).to.be.eql("array");
    });
    it('should return "number" for `0`', function() {
      var r;
      r = typeOf(0);
      return expect(r).to.be.eql("number");
    });
    it('should return "number" for `0.1`', function() {
      var r;
      r = typeOf(0.1);
      return expect(r).to.be.eql("number");
    });
    it('should return "number" for `1.0e4`', function() {
      var r;
      r = typeOf(1.0e4);
      return expect(r).to.be.eql("number");
    });
    it('should return "number" for `0o777`', function() {
      var r;
      r = typeOf(0x1ff);
      return expect(r).to.be.eql("number");
    });
    it('should return "number" for `0xff`', function() {
      var r;
      r = typeOf(0xff);
      return expect(r).to.be.eql("number");
    });
    it('should return "number" for `new Number()`', function() {
      var r;
      r = typeOf(new Number());
      return expect(r).to.be.eql("number");
    });
    it('should return "number" for `Number.NaN`', function() {
      var r;
      r = typeOf(Number.NaN);
      return expect(r).to.be.eql("number");
    });
    it('should return "string" for `"foo"`', function() {
      var r;
      r = typeOf("foo");
      return expect(r).to.be.eql("string");
    });
    it('should return "string" for `\'foo\'`', function() {
      var r;
      r = typeOf('foo');
      return expect(r).to.be.eql("string");
    });
    it('should return "string" for `new String()`', function() {
      var r;
      r = typeOf(new String());
      return expect(r).to.be.eql("string");
    });
    it('should return "function" for function', function() {
      var foo, r;
      foo = function() {
        return this;
      };
      r = typeOf(foo);
      return expect(r).to.be.eql("function");
    });
    it('should return "function" for anonymous function', function() {
      var r;
      r = typeOf(function() {
        return this;
      });
      return expect(r).to.be.eql("function");
    });
    it('should return "function" for `new Function()`', function() {
      var r;
      r = typeOf(new Function());
      return expect(r).to.be.eql("function");
    });
    it('should return "object" for `{}`', function() {
      var r;
      r = typeOf({});
      return expect(r).to.be.eql("object");
    });
    it('should return "object" for class instance', function() {
      var f, r;
      f = function() {
        return this;
      };
      r = typeOf(new f());
      return expect(r).to.be.eql("object");
    });
    it('should return "boolean" for `true`', function() {
      var r;
      r = typeOf(true);
      return expect(r).to.be.eql("boolean");
    });
    it('should return "boolean" for `false`', function() {
      var r;
      r = typeOf(false);
      return expect(r).to.be.eql("boolean");
    });
    return it('should return "boolean" for `new Boolean()`', function() {
      var r;
      r = typeOf(new Boolean());
      return expect(r).to.be.eql("boolean");
    });
  });

  describe('Femto.utils.Originator', function() {
    var Caretaker, Originator, expected_methods, method, _i, _len, _results;
    Originator = Femto.utils.Originator;
    Caretaker = Femto.utils.Caretaker;
    expected_methods = ['createMemento', 'setMemento'];
    _results = [];
    for (_i = 0, _len = expected_methods.length; _i < _len; _i++) {
      method = expected_methods[_i];
      _results.push((function(method) {
        return it("instance should have `" + method + "` method", function() {
          var instance;
          instance = new Originator();
          expect(instance).to.have.property(method);
          return expect(instance[method]).to.be.a('function');
        });
      })(method));
    }
    return _results;
  });

  describe('Femto.utils.Caretaker', function() {
    var Caretaker, Dummy, Originator, dummy, expected_methods, instance, method, _fn, _i, _len;
    Originator = Femto.utils.Originator;
    Caretaker = Femto.utils.Caretaker;
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

    })(Originator);
    dummy = new Dummy();
    instance = new Caretaker(dummy);
    expected_methods = ['originator', 'save', 'undo', 'redo', 'canUndo', 'canRedo'];
    _fn = function(method) {
      return it("instance should have `" + method + "` method", function() {
        expect(instance).to.have.property(method);
        return expect(instance[method]).to.be.a('function');
      });
    };
    for (_i = 0, _len = expected_methods.length; _i < _len; _i++) {
      method = expected_methods[_i];
      _fn(method);
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
      return it('should change originator and return the ' + 'instance when called with a argument', function() {
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
    describe('#save(memento) -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.save();
        expect(r).to.be.eql(instance);
        r = instance.save('HELLO');
        return expect(r).to.be.eql(instance);
      });
      it('should call originator `createMemento()` method ' + 'to get current memento without any argument', function() {
        var createMemento, o;
        o = instance.originator();
        createMemento = o.createMemento;
        o.createMemento = function() {
          return this.createMemento.called = true;
        };
        o.createMemento.called = false;
        instance.save();
        expect(o.createMemento.called).to.be["true"];
        return o.createMemento = createMemento;
      });
      it('should save new memento into `_undoStack` and change ' + '`_previous` when called without any argument', function() {
        dummy.memento = 'HELLO';
        instance.save();
        expect(instance._undoStack.length).to.be.eql(2);
        expect(instance._undoStack[0]).to.be.eql('');
        expect(instance._undoStack[1]).to.be.eql('HELLO');
        return expect(instance._previous).to.be.eql('HELLO');
      });
      it('should save specified memento into `_undoStack` and ' + 'change `_previous` when called with a argument', function() {
        instance.save('HELLO');
        expect(instance._undoStack.length).to.be.eql(2);
        expect(instance._undoStack[0]).to.be.eql('');
        expect(instance._undoStack[1]).to.be.eql('HELLO');
        return expect(instance._previous).to.be.eql('HELLO');
      });
      it('should `push` a memento into `_undoStack` rather than `unshift`', function() {
        instance.save('HELLO1');
        instance.save('HELLO2');
        instance.save('HELLO3');
        expect(instance._undoStack.length).to.be.eql(4);
        return expect(instance._undoStack).to.be.eql(['', 'HELLO1', 'HELLO2', 'HELLO3']);
      });
      return it('should not save a memento which is equal with the previous one', function() {
        instance.save('HELLO');
        instance.save('HELLO');
        instance.save('HELLO');
        expect(instance._undoStack.length).to.be.eql(2);
        expect(instance._undoStack[0]).to.be.eql('');
        return expect(instance._undoStack[1]).to.be.eql('HELLO');
      });
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
      it('should call originator `createMemento()` ' + 'method to get current value', function() {
        var createMemento, o;
        o = instance.originator();
        createMemento = o.createMemento;
        o.createMemento = function() {
          return this.createMemento.called = true;
        };
        o.createMemento.called = false;
        instance.undo();
        expect(o.createMemento.called).to.be["true"];
        return o.createMemento = createMemento;
      });
      it('should call originator `setMemento(value)` ' + 'method to change current value', function() {
        var o, setMemento;
        o = instance.originator();
        setMemento = o.setMemento;
        o.setMemento = function() {
          return this.setMemento.called = true;
        };
        o.setMemento.called = false;
        instance.undo();
        expect(o.setMemento.called).to.be["true"];
        return o.setMemento = setMemento;
      });
      it('should pop previous memento from `_undoStack`', function() {
        var i, _j, _k, _results;
        dummy.memento = "HELLO1";
        for (i = _j = 2; _j <= 3; i = ++_j) {
          instance.save();
          dummy.memento = "HELLO" + i;
        }
        expect(instance._undoStack).to.be.eql(['', 'HELLO1', 'HELLO2']);
        _results = [];
        for (i = _k = 3; _k >= 1; i = --_k) {
          expect(dummy.memento).to.be.eql("HELLO" + i);
          expect(instance._undoStack.length).to.be.eql(i);
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
        expect(dummy.memento).to.be.eql('');
        return expect(instance._redoStack).to.be.eql(['HELLO3', 'HELLO2', 'HELLO1']);
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
      it('should call originator `createMemento()` ' + 'method to get current value', function() {
        var createMemento, o;
        o = instance.originator();
        createMemento = o.createMemento;
        o.createMemento = function() {
          return this.createMemento.called = true;
        };
        o.createMemento.called = false;
        instance.redo();
        expect(o.createMemento.called).to.be["true"];
        return o.createMemento = createMemento;
      });
      it('should call originator `setMemento(value)` method ' + 'to change current value', function() {
        var o, setMemento;
        o = instance.originator();
        setMemento = o.setMemento;
        o.setMemento = function() {
          return this.setMemento.called = true;
        };
        o.setMemento.called = false;
        instance.redo();
        expect(o.setMemento.called).to.be["true"];
        return o.setMemento = setMemento;
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
        expect(instance._redoStack).to.be.eql(['HELLO3', 'HELLO2', 'HELLO1']);
        expect(dummy.memento).to.be.eql("");
        instance.redo();
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
        expect(dummy.memento).to.be.eql("");
        instance.redo();
        for (i = _l = 1; _l <= 2; i = ++_l) {
          expect(dummy.memento).to.be.eql("HELLO" + i);
          expect(instance._undoStack.length).to.be.eql(i);
          instance.redo();
        }
        return expect(instance._undoStack).to.be.eql(['', 'HELLO1', 'HELLO2']);
      });
    });
    describe('#canUndo() -> boolean', function() {
      it('should return boolean', function() {
        var r;
        r = instance.canUndo();
        return expect(r).to.be.a('boolean');
      });
      it('should return `false` when `_undoStack` is empty', function() {
        var r;
        r = instance.canUndo();
        return expect(r).to.be["false"];
      });
      return it('should return `true` when `_undoStack` is not empty', function() {
        var r;
        instance.save('HELLO');
        r = instance.canUndo();
        return expect(r).to.be["true"];
      });
    });
    return describe('#canRedo() -> boolean', function() {
      it('should return boolean', function() {
        var r;
        r = instance.canRedo();
        return expect(r).to.be.a('boolean');
      });
      it('should return `false` when `_redoStack` is empty', function() {
        var r;
        r = instance.canRedo();
        return expect(r).to.be["false"];
      });
      return it('should return `true` when `_redoStack` is not empty', function() {
        var r;
        instance.save('HELLO');
        instance.undo();
        r = instance.canRedo();
        return expect(r).to.be["true"];
      });
    });
  });

}).call(this);
