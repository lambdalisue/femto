#<< utils/indenty
indent = (femto) ->
  textarea = femto.editor.textarea
  femto.features.indent = new Femto.utils.Indenty(textarea)
  femto.features.indent.enable()

namespace 'Femto.features', (exports) ->
  exports.indent = indent
