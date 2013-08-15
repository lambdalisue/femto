(function() {
  var widget;

  widget = function(selector, context, options) {
    var elem, isof, _outerHeight, _outerWidth;
    if (selector == null) {
      selector = '<div>';
    }
    /*
      Create an instance of jQuery extend
    
      @param [String or Object] selector a selector or jQuery instance
      @param [Object] context a context of jQuery
      @param [Object] options an options of femto
      
      @property [Boolean] widget return always true
      @method #nonContntWidth(includeMargin=false)
        Get a total width of the element's non content area
        @param [Boolean] includeMargin if true, returning value include margin area
    
      @method #nonContntHeight(includeMargin=false)
        Get a total height of the element's non content area
        @param [Boolean] includeMargin if true, returning value include margin area
    
      @method #outerWidth (includeMargin, value)
        Get or set a outer width of the element
        @param [Boolean] includeMargin if true, returning value include margin area
          or setting value include margin area
        @param [Number] value if it is specified, an element's outer width will be
          set as the value
    
        @example Get an element's outer width
          widget = Widget()
          widget.outerWidth()           # without margin area
          widget.outerWidth(true)       # with margin area
    
        @example Set an element's outer width
          widget = Widget()
          widget.outerWidth(100)        # without margin area
          widget.outerWidth(true, 100)  # with margin area
    
      @method #outerHeight (includeMargin, value)
        Get or set a outer height of the element
        @param [Boolean] includeMargin if true, returning value include margin area
          or setting value include margin area
        @param [Number] value if it is specified, an element's outer height will be
          set as the value
    
        @example Get an element's outer height
          widget = Widget()
          widget.outerHeight()           # without margin area
          widget.outerHeight(true)       # with margin area
    
        @example Set an element's outer height
          widget = Widget()
          widget.outerHeight(100)        # without margin area
          widget.outerHeight(true, 100)  # with margin area
    */

    isof = function(obj, type) {
      var cls;
      if (!(obj != null) || !obj) {
        return false;
      }
      cls = Object.prototype.toString.call(obj)[{
        8: -1
      }].toLowerCase();
      return cls === type;
    };
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
      if (isof(includeMargin, 'number')) {
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
      if (isof(includeMargin, 'number')) {
        value = includeMargin;
        includeMargin = false;
      }
      if (!(value != null)) {
        return _outerHeight.call(this);
      }
      offset = this.nonContentHeight(includeMargin);
      return this.height(value - offset);
    };
    elem.widget = 'widget';
    return elem;
  };

  namespace('Femto.widgets', function(exports) {
    return exports.widget = widget;
  });

}).call(this);
