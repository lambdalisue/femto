#<< widgets/widget
#<< widgets/editor
###
Femto (0.1.0)

Author: Alisue
Email:  lambdalisue@hashnote.net
Web:    http://hashnote.net/
###
femto = (textarea, options) ->
  Femto.options = options
  elem = Femto.widgets.widget()
  elem.insertAfter(textarea).addClass('femto').hide()
  # add editor
  elem.editor = Femto.widgets.editor(textarea, null, options)
  elem.append elem.editor

  return elem.show()

jQuery.fn.femto = (options) ->
  defaults = {
    'expandTab': true,
    'indentLevel': 4,
  }
  options = jQuery.extend(defaults, options)
  return this.each (i) ->
    self = $(this)
    self.data('femto', femto(self, options))
