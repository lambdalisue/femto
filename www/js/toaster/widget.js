var Widget;

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
    if (utils.type(includeMargin) === 'number') {
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
    if (utils.type(includeMargin) === 'number') {
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
