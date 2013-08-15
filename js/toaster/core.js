
/*
Femto (0.1.0)

Author: Alisue
Email:  lambdalisue@hashnote.net
Web:    http://hashnote.net/
*/


(function() {
  var femto;

  femto = function(textarea, options) {
    var elem;
    Femto.options = options;
    elem = Femto.widgets.widget();
    elem.insertAfter(textarea).addClass('femto').hide();
    elem.editor = Femto.widgets.editor(textarea, null, options);
    elem.append(elem.editor);
    return elem.show();
  };

  jQuery.fn.femto = function(options) {
    var defaults;
    defaults = {
      'expandTab': true,
      'indentLevel': 4
    };
    options = jQuery.extend(defaults, options);
    return this.each(function(i) {
      var self;
      self = $(this);
      return self.data('femto', femto(self, options));
    });
  };

}).call(this);
