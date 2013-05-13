#<< widget/widget
###
Femto DocumentType widget
###
DocumentType = (viewer, documentTypes) ->
  select = jQuery('<select>')
  elem = Femto.widget.Widget()
  elem.addClass('documentType')
  elem.append(select)
  elem.select = select
  # create options
  for key, fn of documentTypes
    option = "<option value='#{key}'>#{key}</option>"
    select.append jQuery(option)
  select.change ->
    fn = documentTypes[select.val()]
    viewer.parser = fn
  select.change()
  return elem

namespace 'Femto.widget', (exports) ->
  exports.DocumentType = DocumentType
