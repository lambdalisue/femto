var Widget;

Widget = function(selector, context) {
  var elem;
  if (selector == null) {
    selector = '<div>';
  }
  if (selector instanceof jQuery) {
    elem = selector;
  } else {
    elem = $(selector, context);
  }
  elem.nonContentWidth = function(includeMargin) {
    if (includeMargin == null) {
      includeMargin = false;
    }
    return this.outerWidth(includeMargin) - this.width();
  };
  elem.nonContentHeight = function(includeMargin) {
    if (includeMargin == null) {
      includeMargin = false;
    }
    return this.outerHeight(includeMargin) - this.height();
  };
  elem._outerWidth = elem.outerWidth;
  elem.outerWidth = function(includeMargin, value) {
    var offset;
    if (includeMargin == null) {
      includeMargin = false;
    }
    if (!(includeMargin != null)) {
      return this._outerWidth();
    }
    if (utils.type(includeMargin) === 'number') {
      value = includeMargin;
      includeMargin = false;
    }
    offset = this.nonContentWidth(includeMargin);
    return this.width(value - offset);
  };
  elem._outerHeight = elem.outerHeight;
  elem.outerHeight = function(includeMargin, value) {
    var offset;
    if (includeMargin == null) {
      includeMargin = false;
    }
    if (!(includeMargin != null)) {
      return this._outerHeight();
    }
    if (utils.type(includeMargin) === 'number') {
      value = includeMargin;
      includeMargin = false;
    }
    offset = this.nonContentHeight(includeMargin);
    return this.height(value - offset);
  };
  return elem;
};
