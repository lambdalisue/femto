#<< utils/template
#<< widget/widget
#<< widget/editor
#<< widget/viewer
###
Femto (0.1.0)

Author: Alisue
Email:  lambdalisue@hashnote.net
Web:    http://hashnote.net/
###
transform = (textarea, options) ->
  options = jQuery.extend({
      'template': new Femto.utils.Template()
      'previewModeShortcut': 'Shift+Right'
      'editingModeShortcut': 'Shift+Left'
      'documentTypes': null
      'documentTypeField': null
      'documentParser': null
    }, options)
  elem = Femto.widget.Widget($('<div>').insertAfter(textarea).hide())
                          .addClass('femto')
  elem.editor = Femto.widget.Editor(textarea)
  elem.viewer = Femto.widget.Viewer(textarea,
    options.template, options.documentParser)
  elem.caretaker = elem.editor.caretaker
  elem.append elem.editor
  elem.append elem.viewer

  if options.documentTypes isnt null
    elem.documentType = Femto.widget.DocumentType(
      elem.viewer,
      options.documentTypes,
      options.documentTypeField,
    )
    elem.editor.append elem.documentType

  elem.init = ->
    @editor.init?()
    @viewer.init?()
    @documentType?.init?()

    # Apply shortcuts
    if options.previewModeShortcut
      shortcut.add options.previewModeShortcut, elem.previewMode,
        target: document
    if options.editingModeShortcut
      shortcut.add options.editingModeShortcut, elem.editingMode,
        target: elem.viewer.iframe.document

    # show femto
    @editingMode(false, false)
    @show()
    return @

  caret_start = caret_end = 0
  elem.previewMode = ->
    # store current caret position
    [caret_start, caret_end] = elem.editor.selection.caret()
    # update viewer
    elem.viewer.val elem.editor.val()
    elem.viewer.focus()
    # because the contents are replaced, shortcut must be set again
    if options.editingModeShortcut
      shortcut.add options.editingModeShortcut, elem.editingMode,
        target: elem.viewer.iframe.document
    # switch to preview mode
    elem.editor.removeClass('active')
    elem.viewer.addClass('active')

  elem.editingMode = (focus=true, caret=true) ->
    #
    # TODO: (Issue) textarea can not get focus back from iframe with the
    #       following code
    #
    # switch to editing mode
    elem.editor.addClass('active')
    elem.viewer.removeClass('active')
    # focus back to the editor
    if focus
      # get focus back from iframe
      window.top.focus()
      # set focus to the editor
      elem.editor.focus()
    # restore caret position
    if caret
      elem.editor.selection.caret caret_start, caret_end

  # Apply features
  elem.features = {}
  for name, feature of Femto.features
    feature(elem)

  jQuery(elem).ready ->
    elem.init()
  return elem

namespace 'Femto', (exports) ->
  exports.transform = transform
