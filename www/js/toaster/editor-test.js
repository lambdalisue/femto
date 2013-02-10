
describe('Editor', function() {
  var expected_classname, expected_methods, expected_properties, instance, method, name, textarea, type, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref;
  textarea = instance = null;
  before(function() {
    textarea = jQuery('<textarea>');
    return instance = Editor(textarea);
  });
  it('should return jQuery instance', function() {
    return expect(instance).to.be.a(jQuery);
  });
  expected_classname = ['panel', 'editor'];
  _fn = function(name) {
    return it("should have `" + name + "` class in its DOM element", function() {
      return expect(instance.hasClass(name)).to.be["true"];
    });
  };
  for (_i = 0, _len = expected_classname.length; _i < _len; _i++) {
    name = expected_classname[_i];
    _fn(name);
  }
  it('DOM element should have `textarea` DOM element in it', function() {
    var children;
    children = instance.children();
    expect(children.length).to.be.eql(1);
    return expect(children[0]).to.be.eql(instance.textarea[0]);
  });
  expected_properties = [['textarea', jQuery], ['caretaker', utils.Caretaker]];
  _fn1 = function(name, type) {
    return it("return instance should have `" + name + "` property as `" + type.name + "`", function() {
      expect(instance).to.have.property(name);
      return expect(instance[name]).to.be.a(type);
    });
  };
  for (_j = 0, _len1 = expected_properties.length; _j < _len1; _j++) {
    _ref = expected_properties[_j], name = _ref[0], type = _ref[1];
    _fn1(name, type);
  }
  expected_methods = ['adjust', 'val'];
  _fn2 = function(method) {
    return it("return instance should have `" + method + "` method", function() {
      expect(instance).to.have.property(method);
      return expect(instance[method]).to.be.a('function');
    });
  };
  for (_k = 0, _len2 = expected_methods.length; _k < _len2; _k++) {
    method = expected_methods[_k];
    _fn2(method);
  }
  describe('#textarea : An extended jQuery instance', function() {
    var action, key, save_trigger_actions, save_trigger_keys, _fn3, _fn4, _fn5, _l, _len3, _len4, _len5, _m, _n, _ref1, _ref2;
    it('should have `widget` property', function() {
      expect(instance.textarea).to.have.property('widget');
      return expect(instance.textarea.widget).to.be.eql(true);
    });
    expected_methods = ['createMemento', 'setMemento'];
    _fn3 = function(method) {
      return it("should have `" + method + "` method", function() {
        expect(instance.textarea).to.have.property(method);
        return expect(instance.textarea[method]).to.be.a('function');
      });
    };
    for (_l = 0, _len3 = expected_methods.length; _l < _len3; _l++) {
      method = expected_methods[_l];
      _fn3(method);
    }
    save_trigger_keys = [['Return', 13], ['Tab', 9], ['Backspace', 8], ['Delete', 46]];
    _fn4 = function(name, key) {
      return it("should call `caretaker.save()` method when user press " + name);
    };
    for (_m = 0, _len4 = save_trigger_keys.length; _m < _len4; _m++) {
      _ref1 = save_trigger_keys[_m], name = _ref1[0], key = _ref1[1];
      _fn4(name, key);
    }
    save_trigger_actions = [['paste', null], ['drop', null]];
    _fn5 = function(name, action) {
      return it("should call `caretaker.save()` method when user " + name + " text");
    };
    for (_n = 0, _len5 = save_trigger_actions.length; _n < _len5; _n++) {
      _ref2 = save_trigger_actions[_n], name = _ref2[0], action = _ref2[1];
      _fn5(name, action);
    }
    describe('#createMemento() -> value', function() {
      return it('should return current value of the textarea', function() {
        var r;
        textarea.val('HELLO');
        r = textarea.createMemento();
        expect(r).to.be.eql('HELLO');
        textarea.val('HELLO2');
        r = textarea.createMemento();
        expect(r).to.be.eql('HELLO2');
        return textarea.val('');
      });
    });
    return describe('#setMemento(value) -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = textarea.setMemento('');
        return expect(r).to.be.eql(textarea);
      });
      return it('should change current value of the textarea', function() {
        textarea.setMemento('HELLO');
        expect(textarea.val()).to.be.eql('HELLO');
        textarea.setMemento('HELLO2');
        expect(textarea.val()).to.be.eql('HELLO2');
        return textarea.val('');
      });
    });
  });
  describe('#caretaker : utils.Caretaker instance', function() {
    return it('should use `textarea` as an originator', function() {
      var originator;
      originator = instance.caretaker.originator();
      return expect(originator).to.be.eql(instance.textarea);
    });
  });
  describe('#val(value) -> value | instance', function() {
    it('should return current value of the textarea when called without any argument', function() {
      var r;
      instance.textarea.val("HELLO");
      r = instance.val();
      expect(r).to.be.eql("HELLO");
      instance.textarea.val("HELLO2");
      r = instance.val();
      expect(r).to.be.eql("HELLO2");
      return instance.textarea.val("");
    });
    return it('should change current value of the textarea when called with an argument', function() {
      instance.val("HELLO");
      expect(instance.val()).to.be.eql("HELLO");
      instance.val("HELLO2");
      expect(instance.val()).to.be.eql("HELLO2");
      return instance.textarea.val("");
    });
  });
  return describe('#adjust() -> instance', function() {
    it('should resize `outerWidth` of textarea to `width` of the instance', function() {
      var outerWidth, width;
      instance.adjust();
      width = instance.width();
      outerWidth = instance.textarea.outerWidth(true);
      return expect(outerWidth).to.be.eql(width);
    });
    return it('should resize `outerHeight` of textarea to `height` of the instance', function() {
      var height, outerHeight;
      instance.adjust();
      height = instance.height();
      outerHeight = instance.textarea.outerHeight(true);
      return expect(outerHeight).to.be.eql(height);
    });
  });
});
