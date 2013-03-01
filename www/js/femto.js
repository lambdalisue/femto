/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;

			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}

			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();

			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;

			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,

				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,

				'pause':19,
				'break':19,

				'insert':45,
				'home':36,
				'delete':46,
				'end':35,

				'pageup':33,
				'page_up':33,
				'pu':33,

				'pagedown':34,
				'page_down':34,
				'pd':34,

				'left':37,
				'up':38,
				'right':39,
				'down':40,

				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}

			var modifiers = {
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};

			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;

			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;

				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character];
							if(character == k) kp++;
						}
					}
				}
			}

			if(kp == keys.length &&
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);

				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;

					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func,
			'target':ele,
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
};

// Generated by CoffeeScript 1.4.0
(function() {
  var __slice = [].slice;

  window.namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref1;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref1 = name.split('.');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      item = _ref1[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

}).call(this);


/*
Cross-browser textarea selection class

@example
  textarea = document.createElement('textarea')
  textarea.selection = new Selection(textarea)
  # get current caret position
  [start, end] = textarea.selection.caret()
  # move caret to [1, 5]
  textarea.selection.caret(1, 5)
  # move caret +4
  textarea.selection.caret(4)
  # get selected text
  selected = textarea.selection.text()
  # replace selected text
  textarea.selection.text("HELLO")
*/


(function() {
  var AutoIndenty, Caretaker, Curtain, DEFAULT_TEMPLATE, Editor, IESelection, IFrame, Indenty, Originator, Template, Viewer, W3CSelection, Widget, autoIndent, indent, makeTabString, occurrences, transform, type,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  W3CSelection = (function() {
    "use strict";

    /*
      Constructor
    
      @param [DOM element] textarea A target textarea DOM element
      @return [Selection] the new instance
    */

    function W3CSelection(textarea) {
      this.textarea = textarea;
      this;

    }

    W3CSelection.prototype._getCaret = function() {
      var e, s;
      s = this.textarea.selectionStart;
      e = this.textarea.selectionEnd;
      return [s, e];
    };

    W3CSelection.prototype._setCaret = function(s, e) {
      this.textarea.setSelectionRange(s, e);
      return this;
    };

    W3CSelection.prototype._getWholeText = function() {
      return this.textarea.value;
    };

    W3CSelection.prototype._setWholeText = function(value) {
      this.textarea.value = value;
      return this;
    };

    W3CSelection.prototype._replace = function(repl, s, e) {
      var a, b, v;
      v = this._getWholeText();
      b = v.substring(0, s);
      a = v.substring(e);
      return this._setWholeText(b + repl + a);
    };

    /*
      Get caret when called without any argument.
      Set caret when called with two arguments.
      Move caret when called with an argument.
    
      @param [Integer] s a start index of the caret or caret offset
      @param [Integer] e a end index of the caret
      @return [Array, Selection] return [s, e] array when called without any
        arguments. return the instance when called with arguments.
      @note caret will be reset when you change the value of textarea, so
        you have to set caret after you change the value if it's needed
    */


    W3CSelection.prototype.caret = function(s, e) {
      var caret, scrollTop;
      if (!(s != null)) {
        return this._getCaret();
      }
      if (!(e != null)) {
        caret = this._getCaret();
        return this.caret(caret[0] + s, caret[1] + s);
      }
      scrollTop = this.textarea.scrollTop;
      this._setCaret(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Return whether the selection's start and end points are the same position
    
      @return [Boolean] true when the selection is collapsed
    */


    W3CSelection.prototype.isCollapsed = function() {
      var e, s, _ref;
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      return s === e;
    };

    /*
      Moves the start point of a range to its end point or vica versa
    
      @param [Boolean] toEnd true to move the end point to the start point
      @return [Selection] instance
    */


    W3CSelection.prototype.collapse = function(toStart) {
      var e, s, _ref;
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      if (toStart) {
        this._setCaret(s, s);
      } else {
        this._setCaret(e, e);
      }
      return this;
    };

    /*
      Get selected text when called without any argument.
      Replace selected text when called with arguments.
    
      @param [String] text a text used to replace the selection
      @param [Boolean] keepSelection select replaced text if it is `true`
      @return [String, Selection] return selected text when called without any
        argument. return the instance when called with arguments
    */


    W3CSelection.prototype.text = function(text, keepSelection) {
      var e, s, scrollTop, _ref;
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      if (!(text != null)) {
        return this._getWholeText().substring(s, e);
      }
      scrollTop = this.textarea.scrollTop;
      this._replace(text, s, e);
      e = s + text.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Get caret of the line on the current caret when called without any argument.
      Get caret of the line on the specified caret when called with two arguments.
    
      @param [Integer] s a start index of the caret
      @param [Integer] e a end index of the caret
      @return [Array] return [s, e] array
    */


    W3CSelection.prototype.lineCaret = function(s, e) {
      var ee, ss, v, _ref;
      if (!(s != null) || !(e != null)) {
        _ref = this._getCaret(), ss = _ref[0], ee = _ref[1];
        s = s != null ? s : ss;
        e = e != null ? e : ee;
      }
      v = this._getWholeText();
      s = v.lastIndexOf("\n", s - 1) + 1;
      e = v.indexOf("\n", e);
      if (e === -1) {
        e = v.length;
      }
      return [s, e];
    };

    /*
      Get line text of the line caret when called without any argument.
      Replace line text of the line caret when called with arguments.
    
      @param [String] text a text used to replace the selection
      @param [Boolean] keepSelection select replaced text if it is `true`
      @return [String, Selection] return selected text when called without any
        argument. return the instance when called with arguments
    */


    W3CSelection.prototype.lineText = function(text, keepSelection) {
      var e, s, scrollTop, _ref;
      _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
      if (!(text != null)) {
        return this._getWholeText().substring(s, e);
      }
      scrollTop = this.textarea.scrollTop;
      this._replace(text, s, e);
      e = s + text.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Insert text before the selection
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


    W3CSelection.prototype.insertBefore = function(text, keepSelection) {
      var e, s, scrollTop, str, _ref;
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      str = this.text();
      scrollTop = this.textarea.scrollTop;
      this._replace(text + str, s, e);
      e = s + text.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Insert text after the selection
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


    W3CSelection.prototype.insertAfter = function(text, keepSelection) {
      var e, s, scrollTop, str, _ref;
      _ref = this._getCaret(), s = _ref[0], e = _ref[1];
      str = this.text();
      scrollTop = this.textarea.scrollTop;
      this._replace(str + text, s, e);
      s = e;
      e = e + text.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Enclose selected text or Open the enclosed text
    
      @param [String] lhs a text used to insert before the selection
      @param [String] rhs a text used to insert after the selection
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


    W3CSelection.prototype.enclose = function(lhs, rhs, keepSelection) {
      var e, lastIndexOf, s, scrollTop, str, text, _ref;
      text = this.text();
      scrollTop = this.textarea.scrollTop;
      lastIndexOf = text.lastIndexOf(rhs);
      if (text.indexOf(lhs) === 0 && lastIndexOf === (text.length - rhs.length)) {
        str = text.substring(lhs.length, text.length - rhs.length);
        this.text(str, keepSelection);
      } else {
        _ref = this._getCaret(), s = _ref[0], e = _ref[1];
        this._replace(lhs + text + rhs, s, e);
        e = s + lhs.length + text.length + rhs.length;
        if (!keepSelection) {
          s = e;
        }
        this._setCaret(s, e);
      }
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Insert text before the line
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


    W3CSelection.prototype.insertBeforeLine = function(text, keepSelection) {
      var e, s, scrollTop, str, _ref;
      _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
      str = this.lineText();
      scrollTop = this.textarea.scrollTop;
      this._replace(text + str, s, e);
      e = s + text.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Insert text after the line
    
      @param [String] text a text used to insert
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


    W3CSelection.prototype.insertAfterLine = function(text, keepSelection) {
      var e, s, scrollTop, str, _ref;
      _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
      str = this.lineText();
      scrollTop = this.textarea.scrollTop;
      this._replace(str + text, s, e);
      s = e;
      e = e + text.length;
      if (!keepSelection) {
        s = e;
      }
      this._setCaret(s, e);
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    /*
      Enclose the line or Open the enclosed line
    
      @param [String] lhs a text used to insert before the selection
      @param [String] rhs a text used to insert after the selection
      @param [Boolean] keepSelection select inserted text if it is `true`
      @return [Selection] return the instance
    */


    W3CSelection.prototype.encloseLine = function(lhs, rhs, keepSelection) {
      var e, lastIndexOf, s, scrollTop, str, text, _ref;
      text = this.lineText();
      scrollTop = this.textarea.scrollTop;
      lastIndexOf = text.lastIndexOf(rhs);
      if (text.indexOf(lhs) === 0 && lastIndexOf === (text.length - rhs.length)) {
        str = text.substring(lhs.length, text.length - rhs.length);
        this.text(str, keepSelection);
      } else {
        _ref = this.lineCaret(), s = _ref[0], e = _ref[1];
        this._replace(lhs + text + rhs, s, e);
        e = s + lhs.length + text.length + rhs.length;
        if (!keepSelection) {
          s = e;
        }
        this._setCaret(s, e);
      }
      this.textarea.scrollTop = scrollTop;
      return this;
    };

    return W3CSelection;

  })();

  namespace('Femto.utils', function(exports) {
    exports.W3CSelection = W3CSelection;
    return exports.Selection = W3CSelection;
  });

  if (document.selection != null) {
    "use strict";

    occurrences = function(str, subStr, allowOverlapping) {
      var n, pos, step;
      str += "";
      subStr += "";
      if (subStr.length <= 0) {
        return str.length + 1;
      }
      n = pos = 0;
      step = allowOverlapping ? 1 : subStr.length;
      while (true) {
        pos = str.indexOf(subStr, pos);
        if (pos >= 0) {
          n++;
          pos += step;
        } else {
          break;
        }
      }
      return n;
    };
    IESelection = (function(_super) {

      __extends(IESelection, _super);

      function IESelection(textarea) {
        this.textarea = textarea;
        this._document = this.textarea.ownerDocument;
      }

      IESelection.prototype._getWholeText = function() {
        var value;
        value = this.textarea.value;
        value = value.replace(/\r\n/g, "\n");
        return value;
      };

      IESelection.prototype._getCaret = function() {
        var clone, e, range, s;
        range = this._document.selection.createRange();
        clone = range.duplicate();
        clone.moveToElementText(this.textarea);
        clone.setEndPoint('EndToEnd', range);
        s = clone.text.length - range.text.length;
        e = s + range.text.length;
        e -= occurrences(range.text, "\r\n");
        return [s, e];
      };

      IESelection.prototype._setCaret = function(s, e) {
        var range;
        range = this.textarea.createTextRange();
        range.collapse(true);
        range.moveStart('character', s);
        range.moveEnd('character', e - s);
        range.select();
        return this;
      };

      return IESelection;

    })(W3CSelection);
    namespace('Femto.utils', function(exports) {
      exports.IESelection = IESelection;
      return exports.Selection = IESelection;
    });
  }

  Curtain = function(widget) {
    var elem;
    if (widget.css('position') === 'static') {
      widget.css('position', 'relative');
    }
    elem = $('<div>').appendTo(widget).hide().css({
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
      'z-index': 10000,
      width: '100%',
      height: '100%'
    });
    elem.adjust = function() {
      this.width(widget.outerWidth(true));
      this.height(height.outerHeight(true));
      return this;
    };
    elem.show = function() {
      this.adjust();
      jQuery.prototype.show.apply(this, arguments);
      return this;
    };
    return elem;
  };

  namespace('Femto.utils', function(exports) {
    return exports.Curtain = Curtain;
  });

  /*
  Base class for Originator
  
  @example
    class Notebook extends utils.Originator
      constructor: ->
        @value = ""
      createMemento: -> @value
      setMemento: (memento) -> @value = memento
  */


  Originator = (function() {
    "use strict";

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
    "use strict";

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

  /*
  Better `typeof` method of javascript
  
  @param [Object] obj object you want to check the type
  @return [String] type
  
  @example
    > utils.type(1)
    'number'
    > utils.type('1')
    'string'
    > utils.type(new String('1'))
    'string'
  
  @see http://coffeescriptcookbook.com/chapters/classes_and_objects/type-function
  */


  type = function(obj) {
    var classToType, myClass, name, _i, _len, _ref;
    if (obj === void 0 || obj === null) {
      return String(obj);
    }
    classToType = new Object;
    _ref = "Boolean Number String Function Array Date RegExp".split(" ");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    myClass = Object.prototype.toString.call(obj);
    if (myClass in classToType) {
      return classToType[myClass];
    }
    return "object";
  };

  namespace('Femto.utils', function(exports) {
    return exports.type = type;
  });

  Widget = function(selector, context) {
    var elem, _outerHeight, _outerWidth;
    if (selector == null) {
      selector = '<div>';
    }
    if (selector instanceof jQuery) {
      elem = selector;
    } else {
      elem = $(selector, context);
    }
    _outerWidth = jQuery.prototype.outerWidth;
    _outerHeight = jQuery.prototype.outerHeight;
    elem.nonContentWidth = function(includeMargin) {
      if (includeMargin == null) {
        includeMargin = false;
      }
      return _outerWidth.call(this, includeMargin) - this.width();
    };
    elem.nonContentHeight = function(includeMargin) {
      if (includeMargin == null) {
        includeMargin = false;
      }
      return _outerHeight.call(this, includeMargin) - this.height();
    };
    elem.outerWidth = function(includeMargin, value) {
      var offset;
      if (Femto.utils.type(includeMargin) === 'number') {
        value = includeMargin;
        includeMargin = false;
      }
      if (!(value != null)) {
        return _outerWidth.call(this);
      }
      offset = this.nonContentWidth(includeMargin);
      return this.width(value - offset);
    };
    elem._outerHeight = elem.outerHeight;
    elem.outerHeight = function(includeMargin, value) {
      var offset;
      if (Femto.utils.type(includeMargin) === 'number') {
        value = includeMargin;
        includeMargin = false;
      }
      if (!(value != null)) {
        return _outerHeight.call(this);
      }
      offset = this.nonContentHeight(includeMargin);
      return this.height(value - offset);
    };
    elem.widget = true;
    return elem;
  };

  namespace('Femto.widget', function(exports) {
    return exports.Widget = Widget;
  });

  IFrame = function() {
    var doc, elem, raw;
    raw = doc = null;
    elem = Femto.widget.Widget('<iframe>');
    elem.css({
      margin: 0,
      padding: 0,
      border: 'none',
      outline: 'none',
      resize: 'none',
      overflow: 'scroll',
      width: '100%',
      height: '100%'
    });
    elem.attr('frameborder', 0);
    elem.focus = function() {
      raw.contentWindow.focus();
      return this;
    };
    elem.init = function() {
      var style;
      raw = this.get(0);
      if (raw.contentDocument != null) {
        doc = raw.contentDocument;
      } else {
        doc = raw.contentWindow.document;
      }
      doc.write('<body></body>');
      style = doc.body.style;
      style.margin = '0';
      style.padding = '0';
      style.width = '100%';
      style.height = '100%';
      return this;
    };
    elem.write = function(value) {
      var scrollTop;
      if (doc != null) {
        try {
          scrollTop = doc.documentElement.scrollTop;
        } catch (e) {
          scrollTop = 0;
        }
        doc.open();
        doc.write(value);
        doc.close();
        $(doc).find('a').attr('target', '_blank');
        doc.documentElement.scrollTop = scrollTop;
      }
      return this;
    };
    elem.curtain = Femto.utils.Curtain(elem);
    return elem;
  };

  namespace('Femto.widget', function(exports) {
    return exports.IFrame = IFrame;
  });

  Editor = function(textarea) {
    var caretaker, elem, raw;
    raw = textarea.get(0);
    textarea = Femto.widget.Widget(textarea);
    textarea._selection = new Femto.utils.Selection(raw);
    textarea.css({
      margin: '0',
      padding: '0',
      border: 'none',
      outline: 'none',
      resize: 'none',
      width: '100%',
      height: '100%'
    });
    textarea.createMemento = textarea.val;
    textarea.setMemento = textarea.val;
    elem = Femto.widget.Widget();
    elem.addClass('panel').addClass('editor');
    elem.append(textarea);
    elem.textarea = textarea;
    elem.selection = textarea._selection;
    elem.focus = function() {
      textarea.focus();
      return this;
    };
    elem.adjust = function() {
      textarea.outerWidth(true, this.width());
      return textarea.outerHeight(true, this.height());
    };
    elem.val = function() {
      return textarea.val.apply(textarea, arguments);
    };
    elem.caretaker = caretaker = (new Femto.utils.Caretaker(textarea)).save();
    textarea.on('keydown', function(e) {
      var _ref;
      if ((_ref = e.which) === 13 || _ref === 9 || _ref === 8 || _ref === 46) {
        return caretaker.save();
      }
    });
    textarea.on('paste,drop', function(e) {
      return caretaker.save();
    });
    return elem;
  };

  namespace('Femto.widget', function(exports) {
    return exports.Editor = Editor;
  });

  Viewer = function(textarea, template) {
    var elem, iframe;
    iframe = Femto.widget.IFrame();
    elem = Femto.widget.Widget();
    elem.addClass('panel').addClass('viewer');
    elem.append(iframe);
    elem.iframe = iframe;
    elem.textarea = textarea;
    elem.template = template;
    elem.curtain = iframe.curtain;
    elem.parser = null;
    elem.init = function() {
      this.iframe.init();
      return this;
    };
    elem.adjust = function() {
      iframe.outerWidth(true, this.width());
      iframe.outerHeight(true, this.height());
      return this;
    };
    elem.focus = function() {
      iframe.focus();
      return this;
    };
    elem.val = function(value) {
      var render,
        _this = this;
      render = function(value) {
        return _this.template.render(value, function(value) {
          return _this.iframe.write(value);
        });
      };
      if (this.parser != null) {
        this.parser.parse(value, render);
      } else {
        render(value);
      }
      return this;
    };
    return elem;
  };

  namespace('Femto.widget', function(exports) {
    return exports.Viewer = Viewer;
  });

  /*
  Cross-browser textarea auto indent manager
  
  @example
    textarea = document.createElement('textarea')
    textarea.autoIndenty = new AutoIndenty(jQuery(textarea))
    # insert newline after current caret with appropriate indent characters
    textarea.autoIndenty.insertNewLine
    # enable auto indent
    textarea.autoIndenty.enable()
    # disable auto indent
    textarea.autoIndenty.disable()
  */


  AutoIndenty = (function() {
    "use strict";

    /*
      Constructor
    
      @param [jQuery] textarea A target textarea DOM element
      @param [bool] expandTab When true, use SPACE insted of TAB for indent
      @param [integer] indentLevel An indent level. Enable only when expandTab is `true`
    */

    function AutoIndenty(textarea, expandTab, indentLevel) {
      var tabString;
      this.textarea = textarea;
      this.expandTab = expandTab != null ? expandTab : true;
      this.indentLevel = indentLevel != null ? indentLevel : 4;
      this._keyDownEvent = __bind(this._keyDownEvent, this);

      if (!(this.textarea instanceof jQuery)) {
        this.textarea = jQuery(this.textarea);
      }
      if (this.textarea._selection != null) {
        this._selection = this.textarea._selection;
      } else {
        this._selection = new Femto.utils.Selection(this.textarea.get(0));
        this.textarea._selection = this._selection;
      }
      if (this.expandTab) {
        tabString = Femto.utils.Indenty._makeTabString(indentLevel);
      } else {
        tabString = "\t";
      }
      this._pattern = new RegExp("^(?:" + tabString + ")*");
    }

    /*
      Insert newline after the current caret position
      with appropriate indent characters (keep previous indent level)
    
      @return [AutoIndenty] the instance
    */


    AutoIndenty.prototype.insertNewLine = function() {
      var cs, indent, line;
      cs = this._selection.caret()[0];
      line = this._selection.lineText().split("\n")[0];
      indent = line.match(this._pattern);
      if (this._selection._getWholeText().substring(cs, cs + 1) === "\n") {
        this._selection.caret(1);
      }
      this._selection.insertAfter("\n" + indent, false);
      return this;
    };

    AutoIndenty.prototype._keyDownEvent = function(e) {
      var RETURN;
      RETURN = 13;
      if (e.which !== RETURN) {
        return;
      }
      if (e.shiftKey) {
        return;
      }
      this.insertNewLine();
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    };

    /*
      Enable auto indent feature on target textarea
    
      @return [AutoIndenty] the instance
    */


    AutoIndenty.prototype.enable = function() {
      var _this = this;
      return this.textarea.on('keydown', function(e) {
        return _this._keyDownEvent(e);
      });
    };

    /*
      Disable auto indent feature on target textarea
    
      @return [AutoIndenty] the instance
    */


    AutoIndenty.prototype.disable = function() {
      var _this = this;
      return this.textarea.off('keydown', function(e) {
        return _this._keyDownEvent(e);
      });
    };

    return AutoIndenty;

  })();

  namespace('Femto.utils', function(exports) {
    return exports.AutoIndenty = AutoIndenty;
  });

  DEFAULT_TEMPLATE = "<html><head>\n  <style>\n    body { color: #333; }\n  </style>\n</head><body>\n  <!--CONTENT-->\n</body></html>";

  Template = (function() {

    function Template(template, templateURI) {
      this.template = template != null ? template : null;
      this.templateURI = templateURI != null ? templateURI : null;
    }

    Template.prototype.load = function(uri, done, force) {
      var success,
        _this = this;
      success = function(data) {
        _this.template = data;
        if (done != null) {
          return dane(data);
        }
      };
      if (this.templateURI !== uri || !(this.template != null) || force) {
        this.templateURI = uri;
        jQuery.ajax({
          url: uri,
          success: success
        });
      }
      return this;
    };

    Template.prototype.render = function(content, done) {
      var render,
        _this = this;
      render = function(template) {
        done(template.replace(/<!--CONTENT-->/g, content));
        return _this;
      };
      if (!(this.template != null) && (this.templateURI != null)) {
        this.load(this.templateURI, render, true);
      } else if (!(this.template != null)) {
        this.template = DEFAULT_TEMPLATE;
      }
      return render(this.template);
    };

    return Template;

  })();

  namespace('Femto.utils', function(exports) {
    return exports.Template = Template;
  });

  /*
  Cross-browser textarea indent manager
  
  @example
    textarea = document.createElement('textarea')
    textarea.indenty = new Indenty(jQuery(textarea))
    # indent at current caret position
    textarea.indenty.indent()
    # outdent at current caret position
    textarea.indenty.outdent()
    # enable TAB key indent
    textarea.indenty.enable()
    # disable TAB key indent
    textarea.indenty.disable()
  */


  makeTabString = function(level) {
    var cache;
    cache = "" + level + "Cache";
    if (!(makeTabString[cache] != null)) {
      makeTabString[cache] = new Array(level + 1).join(" ");
    }
    return makeTabString[cache];
  };

  Indenty = (function() {
    "use strict";

    /*
      Constructor
    
      @param [jQuery] textarea A target textarea DOM element
      @param [bool] expandTab When true, use SPACE insted of TAB for indent
      @param [integer] indentLevel An indent level. Enable only when expandTab is `true`
    */

    function Indenty(textarea, expandTab, indentLevel) {
      this.textarea = textarea;
      this.expandTab = expandTab != null ? expandTab : true;
      this.indentLevel = indentLevel != null ? indentLevel : 4;
      this._keyDownEvent = __bind(this._keyDownEvent, this);

      if (!(this.textarea instanceof jQuery)) {
        this.textarea = jQuery(this.textarea);
      }
      if (this.textarea._selection != null) {
        this._selection = this.textarea._selection;
      } else {
        this._selection = new Femto.utils.Selection(this.textarea.get(0));
        this.textarea._selection = this._selection;
      }
    }

    /*
      Insert tabString at the current caret position
      or start point of the selection
    
      @return [Indenty] the instance
    */


    Indenty.prototype.indent = function() {
      var cs, diff, keepSelection, l, ls, modified, rels, selected, tabString;
      selected = this._selection.text();
      if (__indexOf.call(selected, "\n") >= 0) {
        if (this.expandTab) {
          tabString = makeTabString(this.indentLevel);
        } else {
          tabString = "\t";
        }
        selected = this._selection.lineText();
        modified = (function() {
          var _i, _len, _ref, _results;
          _ref = selected.split("\n");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            l = _ref[_i];
            _results.push(tabString + l);
          }
          return _results;
        })();
        this._selection.lineText(modified.join("\n"), true);
      } else {
        keepSelection = !this._selection.isCollapsed();
        if (this.expandTab) {
          cs = this._selection.caret()[0];
          ls = this._selection.lineCaret()[0];
          rels = cs - ls;
          diff = rels % this.indentLevel;
          tabString = makeTabString(this.indentLevel - diff);
        } else {
          tabString = "\t";
        }
        this._selection.text(tabString + selected, keepSelection);
      }
      return this;
    };

    /*
      Remove tabString at the current caret position
      or the left hand of the selection
    
      It will not do anything if no tabString is found
    
      @return [Indenty] the instance
    */


    Indenty.prototype.outdent = function() {
      var a, b, cs, index, l, line, ls, modified, pattern, selected, tabString;
      if (this.expandTab) {
        tabString = makeTabString(this.indentLevel);
      } else {
        tabString = "\t";
      }
      pattern = new RegExp("^" + tabString);
      selected = this._selection.text();
      if (__indexOf.call(selected, "\n") >= 0) {
        selected = this._selection.lineText();
        modified = (function() {
          var _i, _len, _ref, _results;
          _ref = selected.split("\n");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            l = _ref[_i];
            _results.push(l.replace(pattern, ""));
          }
          return _results;
        })();
        this._selection.lineText(modified.join("\n"), true);
      } else {
        cs = this._selection.caret()[0];
        ls = this._selection.lineCaret()[0];
        line = this._selection.lineText();
        index = line.lastIndexOf(tabString, cs - ls);
        if (index === -1) {
          return this;
        }
        b = line.substring(0, index);
        a = line.substring(index + tabString.length);
        this._selection.lineText(b + a, false);
        this._selection.caret(ls + index, ls + index);
      }
      return this;
    };

    Indenty.prototype._keyDownEvent = function(e) {
      if (e.which !== 9) {
        return;
      }
      if (e.shiftKey) {
        this.outdent();
      } else {
        this.indent();
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    };

    /*
      Enable TAB key indent feature on target textarea
    
      @return [Indenty] the instance
    */


    Indenty.prototype.enable = function() {
      this.textarea.on('keydown', this._keyDownEvent);
      return this;
    };

    /*
      Disable TAB key indent feature on target textarea
    
      @return [Indenty] the instance
    */


    Indenty.prototype.disable = function() {
      this.textarea.off('keydown', this._keyDownEvent);
      return this;
    };

    return Indenty;

  })();

  Indenty._makeTabString = makeTabString;

  namespace('Femto.utils', function(exports) {
    return exports.Indenty = Indenty;
  });

  autoIndent = function(femto) {
    var textarea;
    textarea = femto.editor.textarea;
    femto.features.autoIndent = new Femto.utils.AutoIndenty(textarea);
    return femto.features.autoIndent.enable();
  };

  namespace('Femto.features', function(exports) {
    return exports.autoIndent = autoIndent;
  });

  indent = function(femto) {
    var textarea;
    textarea = femto.editor.textarea;
    femto.features.indent = new Femto.utils.Indenty(textarea);
    return femto.features.indent.enable();
  };

  namespace('Femto.features', function(exports) {
    return exports.indent = indent;
  });

  transform = function(textarea, options) {
    var caret_end, caret_start, elem, feature, name, _ref;
    options = jQuery.extend({
      'template': new Femto.utils.Template(),
      'previewModeShortcut': 'Shift+Right',
      'editingModeShortcut': 'Shift+Left'
    }, options);
    elem = Femto.widget.Widget($('<div>').insertAfter(textarea).hide()).addClass('femto');
    elem.editor = Femto.widget.Editor(textarea);
    elem.viewer = Femto.widget.Viewer(textarea, options.template);
    elem.caretaker = elem.editor.caretaker;
    elem.append(elem.editor);
    elem.append(elem.viewer);
    elem.init = function() {
      var _base, _base1;
      if (typeof (_base = this.editor).init === "function") {
        _base.init();
      }
      if (typeof (_base1 = this.viewer).init === "function") {
        _base1.init();
      }
      if (options.previewModeShortcut) {
        shortcut.add(options.previewModeShortcut, elem.previewMode, {
          target: elem.editor.textarea.get(0)
        });
      }
      if (options.editingModeShortcut) {
        shortcut.add(options.editingModeShortcut, elem.editingMode, {
          target: elem.viewer.iframe.contents().get(0)
        });
      }
      this.editingMode();
      this.show();
      return this;
    };
    elem.adjust = function() {
      return this;
    };
    caret_start = caret_end = 0;
    elem.previewMode = function() {
      var _ref;
      _ref = elem.editor.selection.caret(), caret_start = _ref[0], caret_end = _ref[1];
      elem.viewer.val(elem.editor.val());
      elem.viewer.focus();
      if (options.editingModeShortcut) {
        shortcut.add(options.editingModeShortcut, elem.editingMode, {
          target: elem.viewer.iframe.contents().get(0)
        });
      }
      elem.editor.removeClass('active');
      return elem.viewer.addClass('active');
    };
    elem.editingMode = function() {
      elem.editor.selection.caret(caret_start, caret_end);
      elem.editor.focus();
      elem.editor.addClass('active');
      return elem.viewer.removeClass('active');
    };
    elem.features = {};
    _ref = Femto.features;
    for (name in _ref) {
      feature = _ref[name];
      feature(elem);
    }
    jQuery(elem).ready(function() {
      return elem.init().adjust();
    });
    return elem;
  };

  namespace('Femto', function(exports) {
    return exports.transform = transform;
  });

  Originator = Femto.utils.Originator;

  Caretaker = Femto.utils.Caretaker;

  describe('Femto.utils.Originator', function() {
    var expected_methods, method, _i, _len, _results;
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

  describe('utils.Caretaker', function() {
    var Dummy, dummy, expected_methods, instance, method, _fn, _i, _len;
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
      it('should call originator `createMemento()` method to get current memento without any argument');
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
        it('should call originator `createMemento()` method to get current value');
        it('should call originator `setMemento(value)` method to change current value');
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
        it('should call originator `createMemento()` method to get current value');
        it('should call originator `setMemento(value)` method to change current value');
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
  });

  describe('Femto.utils.AutoIndenty', function() {
    var Selection, expected_methods, expected_private_methods, expected_private_properties, expected_properties, instance, method, name, selection, textarea, value, _fn, _fn1, _fn2, _fn3, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    textarea = instance = selection = value = null;
    AutoIndenty = Femto.utils.AutoIndenty;
    Selection = Femto.utils.Selection;
    before(function() {
      textarea = document.createElement('textarea');
      textarea.rollback = function() {
        return this.value = 'AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333';
      };
      textarea.rollback();
      value = function() {
        return textarea.value.replace(/\r\n/g, "\n");
      };
      instance = new AutoIndenty(jQuery(textarea), true, 4);
      selection = instance._selection;
      document.body.appendChild(textarea);
      return textarea.focus();
    });
    after(function() {
      return document.body.removeChild(textarea);
    });
    afterEach(function() {
      return textarea.rollback();
    });
    expected_private_properties = [['_selection', Selection]];
    _fn = function(name, type) {
      return it("instance should have private `" + name + "` property", function() {
        expect(instance).to.have.property(name);
        return expect(instance[name]).to.be.a(type);
      });
    };
    for (_i = 0, _len = expected_private_properties.length; _i < _len; _i++) {
      _ref = expected_private_properties[_i], name = _ref[0], type = _ref[1];
      _fn(name, type);
    }
    expected_properties = [['textarea', null], ['expandTab', 'boolean'], ['indentLevel', 'number']];
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
    expected_private_methods = ['_keyDownEvent'];
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
    expected_methods = ['insertNewLine', 'enable', 'disable'];
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
    return describe('#insertNewLine() -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.insertNewLine();
        expect(r).to.be.a(AutoIndenty);
        return expect(r).to.be.eql(instance);
      });
      it('should insert newline after the current caret', function() {
        selection.caret(15, 15);
        instance.insertNewLine();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\n\naaaaabbbbbccccc\n111112222233333");
        textarea.rollback();
        selection.caret(21, 21);
        instance.insertNewLine();
        return expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaa\nbbbbbccccc\n111112222233333");
      });
      return it('should insert leading tabString and newline after the current caret if the current line starts from tabString', function() {
        textarea.value = "    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333";
        selection.caret(19, 19);
        instance.insertNewLine();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n\n    aaaaabbbbbccccc\n111112222233333");
        textarea.value = "AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333";
        selection.caret(25, 25);
        instance.insertNewLine();
        return expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaa\n    bbbbbccccc\n111112222233333");
      });
    });
  });

  describe('Femto.utils.type', function() {
    var cases, obj, result, _i, _len, _ref, _results;
    type = Femto.utils.type;
    cases = [
      [0, 'number'], [1.2, 'number'], [[0, 1], 'array'], [new Array, 'array'], [
        {
          0: 1
        }, 'object'
      ], [null, 'null'], [void 0, 'undefined'], [NaN, 'number']
    ];
    _results = [];
    for (_i = 0, _len = cases.length; _i < _len; _i++) {
      _ref = cases[_i], obj = _ref[0], result = _ref[1];
      _results.push((function(obj, result) {
        return it("should return '" + result + "' for `" + obj + "`", function() {
          return expect(type(obj)).to.be.eql(result);
        });
      })(obj, result));
    }
    return _results;
  });

  describe('Femto.utils.Selection', function() {
    var Selection, expected_methods, expected_private_methods, instance, method, textarea, value, _fn, _fn1, _i, _j, _len, _len1;
    textarea = instance = value = null;
    Selection = Femto.utils.Selection;
    before(function() {
      textarea = document.createElement('textarea');
      textarea.rollback = function() {
        return this.value = 'AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333';
      };
      textarea.rollback();
      value = function() {
        return textarea.value.replace(/\r\n/g, "\n");
      };
      instance = new Selection(textarea);
      document.body.appendChild(textarea);
      return textarea.focus();
    });
    after(function() {
      return document.body.removeChild(textarea);
    });
    afterEach(function() {
      return textarea.rollback();
    });
    expected_private_methods = ['_getCaret', '_setCaret', '_replace'];
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
    expected_methods = ['caret', 'text', 'lineCaret', 'lineText', 'isCollapsed', 'collapse', 'insertBefore', 'insertAfter', 'enclose', 'insertBeforeLine', 'insertAfterLine', 'encloseLine'];
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
    describe('#caret(s, e) -> [s, e] | instance', function() {
      it('should return current caret position as a list when called without any arguments', function() {
        var caret;
        instance.caret(0, 0);
        caret = instance.caret();
        expect(caret).to.be.a('array');
        return expect(caret).to.be.eql([0, 0]);
      });
      it('should return the instance when called with arguments', function() {
        var result;
        result = instance.caret(0, 0);
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        result = instance.caret(0);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it('should change caret position to specified when called with two arguments', function() {
        var caret;
        caret = instance.caret(1, 2).caret();
        return expect(caret).to.be.eql([1, 2]);
      });
      return it('should change caret position with specified offset when called with one argument', function() {
        var ncaret, pcaret;
        pcaret = instance.caret(0, 0).caret();
        ncaret = instance.caret(5).caret();
        return expect(ncaret).to.be.eql([pcaret[0] + 5, pcaret[1] + 5]);
      });
    });
    describe('#isCollapsed() -> boolean', function() {
      it('should return true when the start and end points of the selection are the same', function() {
        instance.caret(0, 0);
        expect(instance.isCollapsed()).to.be["true"];
        instance.caret(5, 5);
        return expect(instance.isCollapsed()).to.be["true"];
      });
      return it('should return false when the start and end points of the selection are not the same', function() {
        instance.caret(0, 1);
        expect(instance.isCollapsed()).to.be["false"];
        instance.caret(5, 6);
        return expect(instance.isCollapsed()).to.be["true"];
      });
    });
    describe('#collapse(toStart) -> instance', function() {
      it('should moves the start point of the selection to its end point and return the instance when called without argument', function() {
        var e, r, s, _ref;
        instance.caret(0, 10);
        r = instance.collapse();
        _ref = instance.caret(), s = _ref[0], e = _ref[1];
        expect(r).to.be.a(Selection);
        expect(r).to.be.eql(instance);
        expect(s).to.be.eql(10);
        return expect(e).to.be.eql(10);
      });
      return it('should moves the start point of the selection to its end point and return the instance when called with argument', function() {
        var e, r, s, _ref;
        instance.caret(0, 10);
        r = instance.collapse(true);
        _ref = instance.caret(), s = _ref[0], e = _ref[1];
        expect(r).to.be.a(Selection);
        expect(r).to.be.eql(instance);
        expect(s).to.be.eql(0);
        return expect(e).to.be.eql(0);
      });
    });
    describe('#text(text, keepSelection) -> string | instance', function() {
      it('should return current selected text when called without any arguments', function() {
        var text;
        instance.caret(0, 0);
        text = instance.text();
        expect(text).to.be.a('string');
        expect(text).to.be.eql('');
        instance.caret(5, 25 + 1);
        text = instance.text();
        return expect(text).to.be.eql("BBBBBCCCCC\naaaaabbbbb");
      });
      it('should return the instance when called with arguments', function() {
        var result;
        instance.caret(0, 0);
        result = instance.text('HELLO');
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.text('HELLO', true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it('should insert text before the caret when no text is selected and called with one argument', function() {
        var result;
        instance.caret(0, 0);
        result = instance.text("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text before the caret and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.text("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should replace text of selected when text is selected and called with one argument", function() {
        var result;
        instance.caret(3, 12);
        result = instance.text("HELLO");
        return expect(value()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should replace text of selected and select replacement when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(3, 12);
        result = instance.text("HELLO", true);
        expect(value()).to.be.eql("AAAHELLOCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([3, 8]);
      });
    });
    describe("#lineCaret(s, e) -> [s, e]", function() {
      it("should return current line caret position as a list when called without any arguments", function() {
        var lcaret;
        instance.caret(5, 25 + 1);
        lcaret = instance.lineCaret();
        expect(lcaret).to.be.a("array");
        return expect(lcaret).to.be.eql([0, 30 + 1]);
      });
      return it("should return specified line caret position as a list when called with arguments", function() {
        var lcaret;
        instance.caret(0, 0);
        lcaret = instance.lineCaret(5, 25 + 1);
        expect(lcaret).to.be.a("array");
        expect(lcaret).to.be.eql([0, 30 + 1]);
        return expect(instance.caret()).to.be.eql([0, 0]);
      });
    });
    describe("#lineText(text, keepSelection) -> string | instance", function() {
      it("should return current selected line text when called without any arguments", function() {
        var text;
        instance.caret(0, 0);
        text = instance.lineText();
        expect(text).to.be.a("string");
        expect(text).to.be.eql("AAAAABBBBBCCCCC");
        instance.caret(5, 25 + 1);
        text = instance.lineText();
        return expect(text).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc");
      });
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.lineText("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.lineText("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should replace single line of caret position when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.lineText("HELLO");
        return expect(value()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333");
      });
      it("should replace single line of caret position and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.lineText("HELLO", true);
        expect(value()).to.be.eql("HELLO\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should replace lines of selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(5, 25 + 1);
        result = instance.lineText("HELLO");
        return expect(value()).to.be.eql("HELLO\n111112222233333");
      });
      return it("should replace lines of selection and select replacement when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(5, 25 + 1);
        result = instance.lineText("HELLO", true);
        expect(value()).to.be.eql("HELLO\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
    });
    describe("#insertBefore(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBefore("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertBefore("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text before the caret when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBefore("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text before the caret and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertBefore("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text before the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertBefore("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text before the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertBefore("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
    });
    describe("#insertAfter(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfter("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertAfter("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text after the caret when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfter("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text after the caret and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertAfter("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text after the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertAfter("HELLO");
        return expect(value()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text after the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertAfter("HELLO", true);
        expect(value()).to.be.eql("AAAAAHELLOBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([5, 10]);
      });
    });
    describe("#enclose(lhs, rhs, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.enclose("HELLO", "WORLD");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.enclose("HELLO", "WORLD", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert both text before the caret when no text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.enclose("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert both text before the caret and select insertion when no text is selected and called with three arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOWORLDAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 10]);
      });
      it("should enclose the selection with specified when text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 5);
        result = instance.enclose("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should enclose the selection with specified and select text include insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOAAAAAWORLDBBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 15]);
      });
      it("should remove specified when selected text (or caret) is enclosed and called with two arguments", function() {
        instance.caret(0, 0);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.caret(5, 10);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should remove specified and select text when selected text (or caret) is enclosed and called with three arguments", function() {
        var caret;
        instance.caret(0, 0);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        expect(caret).to.be.eql([0, 0]);
        instance.caret(5, 10);
        instance.enclose("HELLO", "WORLD", true);
        instance.enclose("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([5, 10]);
      });
    });
    describe("#insertBeforeLine(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBeforeLine("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertBeforeLine("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text before the current line when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertBeforeLine("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text before the current line and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertBeforeLine("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
      it("should insert text before the line of the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertBeforeLine("HELLO");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text before the line of the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertBeforeLine("HELLO", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 5]);
      });
    });
    describe("#insertAfterLine(text, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfterLine("HELLO");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.insertAfterLine("HELLO", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert text after the current line when no text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 0);
        result = instance.insertAfterLine("HELLO");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert text after the current line and select insertion when no text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.insertAfterLine("HELLO", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([15, 20]);
      });
      it("should insert text after the line of the selection when text is selected and called with one argument", function() {
        var result;
        instance.caret(0, 5);
        result = instance.insertAfterLine("HELLO");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should insert text after the line of the selection and select insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.insertAfterLine("HELLO", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCCHELLO\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([15, 20]);
      });
    });
    return describe("#encloseLine(lhs, rhs, keepSelection) -> instance", function() {
      it("should return the instance when called with arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.encloseLine("HELLO", "WORLD");
        expect(result).to.be.a(Selection);
        expect(result).to.be.eql(instance);
        textarea.rollback();
        result = instance.encloseLine("HELLO", "WORLD", true);
        expect(result).to.be.a(Selection);
        return expect(result).to.be.eql(instance);
      });
      it("should insert both text before the current line when no text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 0);
        result = instance.encloseLine("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
      });
      it("should insert both text before the current line and select insertion when no text is selected and called with three arguments", function() {
        var caret, result;
        instance.caret(0, 0);
        result = instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 25]);
      });
      it("should encloseLine the line of the selection with specified when text is selected and called with two arguments", function() {
        var result;
        instance.caret(0, 5);
        result = instance.encloseLine("HELLO", "WORLD");
        return expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
      });
      it("should encloseLine the line of the selection with specified and select text include insertion when text is selected and called with two arguments", function() {
        var caret, result;
        instance.caret(0, 5);
        result = instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("HELLOAAAAABBBBBCCCCCWORLD\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 25]);
      });
      it("should remove specified when selected text (or caret) is encloseLined and called with two arguments", function() {
        instance.caret(0, 0);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD");
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.caret(5, 10);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD");
        return expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      return it("should remove specified and select text when selected text (or caret) is encloseLined and called with three arguments", function() {
        var caret;
        instance.caret(0, 0);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        expect(caret).to.be.eql([0, 15]);
        instance.caret(5, 10);
        instance.encloseLine("HELLO", "WORLD", true);
        instance.encloseLine("HELLO", "WORLD", true);
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        caret = instance.caret();
        return expect(caret).to.be.eql([0, 15]);
      });
    });
  });

  describe('Femto.utils.Indenty', function() {
    var Selection, expected_methods, expected_private_methods, expected_private_properties, expected_properties, instance, method, name, selection, textarea, value, _fn, _fn1, _fn2, _fn3, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    textarea = instance = selection = value = null;
    Indenty = Femto.utils.Indenty;
    Selection = Femto.utils.Selection;
    before(function() {
      textarea = document.createElement('textarea');
      textarea.rollback = function() {
        return this.value = 'AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333';
      };
      textarea.rollback();
      value = function() {
        return textarea.value.replace(/\r\n/g, "\n");
      };
      instance = new Indenty(jQuery(textarea), true, 4);
      selection = instance._selection;
      document.body.appendChild(textarea);
      return textarea.focus();
    });
    after(function() {
      return document.body.removeChild(textarea);
    });
    afterEach(function() {
      return textarea.rollback();
    });
    expected_private_properties = [['_selection', Selection]];
    _fn = function(name, type) {
      return it("instance should have private `" + name + "` property", function() {
        expect(instance).to.have.property(name);
        return expect(instance[name]).to.be.a(type);
      });
    };
    for (_i = 0, _len = expected_private_properties.length; _i < _len; _i++) {
      _ref = expected_private_properties[_i], name = _ref[0], type = _ref[1];
      _fn(name, type);
    }
    expected_properties = [['textarea', null], ['expandTab', 'boolean'], ['indentLevel', 'number']];
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
    expected_private_methods = ['_keyDownEvent'];
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
    expected_methods = ['indent', 'outdent', 'enable', 'disable'];
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
        expect(r).to.be.a(Indenty);
        return expect(r).to.be.eql(instance);
      });
      it('should insert appropriate number of spaces before the caret', function() {
        selection.caret(0, 0);
        instance.indent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("        AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        textarea.rollback();
        selection.caret(5, 5);
        instance.indent();
        expect(value()).to.be.eql("AAAAA   BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("AAAAA       BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        textarea.rollback();
        selection.caret(15, 15);
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC \naaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC     \naaaaabbbbbccccc\n111112222233333");
        textarea.rollback();
        selection.caret(16, 16);
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n111112222233333");
        return textarea.rollback();
      });
      it('should insert appropriate number of spaces before the selection when selection is in single line', function() {
        selection.caret(0, 5);
        instance.indent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("        AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        textarea.rollback();
        selection.caret(5, 10);
        instance.indent();
        expect(value()).to.be.eql("AAAAA   BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("AAAAA      BBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
        textarea.rollback();
        selection.caret(16, 21);
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n111112222233333");
        return textarea.rollback();
      });
      it('should insert 4 spaces before each selected line when selection is in multi lines', function() {
        selection.caret(5, 20);
        instance.indent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n111112222233333");
        instance.indent();
        expect(value()).to.be.eql("        AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n111112222233333");
        textarea.rollback();
        selection.caret(20, 35);
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333");
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n        111112222233333");
        textarea.rollback();
        selection.caret(5, 35);
        instance.indent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333");
        instance.indent();
        return expect(value()).to.be.eql("        AAAAABBBBBCCCCC\n        aaaaabbbbbccccc\n        111112222233333");
      });
      it('should move the caret to the end point of the insertion', function() {
        selection.caret(0, 0);
        instance.indent();
        expect(selection.caret()).to.be.eql([4, 4]);
        instance.indent();
        expect(selection.caret()).to.be.eql([8, 8]);
        textarea.rollback();
        selection.caret(5, 5);
        instance.indent();
        expect(selection.caret()).to.be.eql([8, 8]);
        instance.indent();
        expect(selection.caret()).to.be.eql([12, 12]);
        textarea.rollback();
        selection.caret(15, 15);
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC \naaaaabbbbbccccc\n111112222233333");
        expect(selection.caret()).to.be.eql([16, 16]);
        instance.indent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC     \naaaaabbbbbccccc\n111112222233333");
        expect(selection.caret()).to.be.eql([20, 20]);
        textarea.rollback();
        selection.caret(16, 16);
        instance.indent();
        expect(selection.caret()).to.be.eql([20, 20]);
        instance.indent();
        expect(selection.caret()).to.be.eql([24, 24]);
        return textarea.rollback();
      });
      return it('should move the selection when selection is in multi lines', function() {
        selection.caret(5, 20);
        instance.indent();
        expect(selection.caret()).to.be.eql([0, 39]);
        instance.indent();
        expect(selection.caret()).to.be.eql([0, 47]);
        textarea.rollback();
        selection.caret(20, 35);
        instance.indent();
        expect(selection.caret()).to.be.eql([16, 55]);
        instance.indent();
        expect(selection.caret()).to.be.eql([16, 63]);
        textarea.rollback();
        selection.caret(5, 35);
        instance.indent();
        expect(selection.caret()).to.be.eql([0, 59]);
        instance.indent();
        return expect(selection.caret()).to.be.eql([0, 71]);
      });
    });
    return describe('#outdent() -> instance', function() {
      it('should return the instance', function() {
        var r;
        r = instance.outdent();
        expect(r).to.be.a(Indenty);
        return expect(r).to.be.eql(instance);
      });
      it('should not do anything when no tabString exists', function() {
        var caret_set, e, s, _len4, _m, _ref2, _results;
        caret_set = [[0, 0], [5, 5], [0, 5], [5, 10], [16, 21]];
        _results = [];
        for (_m = 0, _len4 = caret_set.length; _m < _len4; _m++) {
          _ref2 = caret_set[_m], s = _ref2[0], e = _ref2[1];
          selection.caret(s, e);
          instance.outdent();
          _results.push(expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333"));
        }
        return _results;
      });
      it('should remove tabString when the start point of the selection stands on the tabString and the selection is in single line', function() {
        textarea.value = "    AAAAABBBBBCCCCC";
        selection.caret(2, 2);
        instance.outdent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC");
        textarea.value = "    AAAAABBBBBCCCCC";
        selection.caret(2, 8);
        instance.outdent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC");
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc";
        selection.caret(22, 22);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc");
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc";
        selection.caret(22, 28);
        instance.outdent();
        return expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc");
      });
      it('should remove only one tabString even there are two when the start point of the selection stands on the tabString and the selection is in single line', function() {
        textarea.value = "        AAAAABBBBBCCCCC";
        selection.caret(2, 2);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC");
        textarea.value = "        AAAAABBBBBCCCCC";
        selection.caret(2, 8);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC");
        textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc";
        selection.caret(22, 22);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc");
        textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc";
        selection.caret(22, 28);
        instance.outdent();
        return expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc");
      });
      it('should remove tabString of the left hand side of the selection is in single line', function() {
        textarea.value = "    AAAAABBBBBCCCCC";
        selection.caret(5, 5);
        instance.outdent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC");
        textarea.value = "    AAAAABBBBBCCCCC";
        selection.caret(8, 8);
        instance.outdent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC");
        textarea.value = "    AAAAABBBBBCCCCC";
        selection.caret(5, 8);
        instance.outdent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC");
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc";
        selection.caret(25, 25);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc");
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc";
        selection.caret(25, 28);
        instance.outdent();
        return expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc");
      });
      it('should remove only one tabString of the left hand side of the selection even there are two and when the selection is in single line', function() {
        textarea.value = "        AAAAABBBBBCCCCC";
        selection.caret(9, 9);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC");
        textarea.value = "        AAAAABBBBBCCCCC";
        selection.caret(12, 12);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC");
        textarea.value = "        AAAAABBBBBCCCCC";
        selection.caret(9, 12);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC");
        textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc";
        selection.caret(29, 29);
        instance.outdent();
        expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc");
        textarea.value = "    AAAAABBBBBCCCCC\n        aaaaabbbbbccccc";
        selection.caret(29, 32);
        instance.outdent();
        return expect(value()).to.be.eql("    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc");
      });
      it('should remove tabString of the left and side of the each lines when the selection is in multi line', function() {
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333";
        selection.caret(10, 30);
        instance.outdent();
        expect(value()).to.be.eql("AAAAABBBBBCCCCC\naaaaabbbbbccccc\n    111112222233333");
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333";
        selection.caret(30, 50);
        instance.outdent();
        return expect(value()).to.be.eql("    AAAAABBBBBCCCCC\naaaaabbbbbccccc\n111112222233333");
      });
      it('should move the caret to the removed point when the selection is in single line', function() {
        textarea.value = "    AAAAABBBBBCCCCC";
        selection.caret(2, 2);
        instance.outdent();
        expect(selection.caret()).to.be.eql([0, 0]);
        textarea.value = "    AAAAABBBBBCCCCC";
        selection.caret(2, 8);
        instance.outdent();
        expect(selection.caret()).to.be.eql([0, 0]);
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc";
        selection.caret(22, 22);
        instance.outdent();
        expect(selection.caret()).to.be.eql([20, 20]);
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc";
        selection.caret(22, 28);
        instance.outdent();
        return expect(selection.caret()).to.be.eql([20, 20]);
      });
      return it('should move the line selection after outdent when the selection is in multi line', function() {
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333";
        selection.caret(10, 30);
        instance.outdent();
        expect(selection.caret()).to.be.eql([0, 31]);
        textarea.value = "    AAAAABBBBBCCCCC\n    aaaaabbbbbccccc\n    111112222233333";
        selection.caret(30, 50);
        instance.outdent();
        return expect(selection.caret()).to.be.eql([20, 51]);
      });
    });
  });

  describe('Femto.widget.Widget', function() {
    var expected_methods, method, _i, _len, _results;
    Widget = Femto.widget.Widget;
    it('should return jQuery instance', function() {
      var instance;
      instance = Widget();
      return expect(instance).to.be.a(jQuery);
    });
    it('should return same (but extended) jQuery instance when it specified', function() {
      var div, instance;
      div = jQuery('<div>');
      instance = Widget(div);
      return expect(instance).to.be.eql(div);
    });
    it('should have `widget` property', function() {
      var instance;
      instance = Widget();
      expect(instance).to.have.property('widget');
      return expect(instance.widget).to.be.eql(true);
    });
    expected_methods = ['nonContentWidth', 'nonContentHeight', 'outerWidth', 'outerHeight'];
    _results = [];
    for (_i = 0, _len = expected_methods.length; _i < _len; _i++) {
      method = expected_methods[_i];
      _results.push((function(method) {
        return it("return instance should have `" + method + "` method", function() {
          var instance;
          instance = Widget();
          expect(instance).to.have.property(method);
          return expect(instance[method]).to.be.a('function');
        });
      })(method));
    }
    return _results;
  });

  describe('Femto.widget.Editor', function() {
    var expected_classname, expected_methods, expected_properties, instance, method, name, textarea, _fn, _fn1, _fn2, _i, _j, _k, _len, _len1, _len2, _ref;
    Editor = Femto.widget.Editor;
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
    expected_properties = [['textarea', jQuery], ['caretaker', Femto.utils.Caretaker]];
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

}).call(this);
