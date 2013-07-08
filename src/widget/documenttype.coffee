#<< widget/widget
###
Femto DocumentType widget
###
DocumentType = (viewer, documentTypes, documentTypeField) ->
  if documentTypeField?
    select = jQuery(documentTypeField)
  else
    select = jQuery('<select>')
  elem = Femto.widget.Widget()
  elem.addClass('documentType')
  elem.append(select)
  elem.documentTypes = documentTypes
  elem.documentTypeField = select
  # create options
  for key, fn of documentTypes
    option = "<option value='#{key}'>#{key}</option>"
    select.append jQuery(option)
  select.change ->
    parser = documentTypes[select.val()]
    viewer.setParser parser
  select.change()
  return elem

namespace 'Femto.widget', (exports) ->
  exports.DocumentType = DocumentType
