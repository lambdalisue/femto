#<< utils/autoindenty
autoIndent = (femto) ->
  textarea = femto.editor.textarea
  femto.features.autoIndent = new Femto.utils.AutoIndenty(textarea)
  femto.features.autoIndent.enable()

namespace 'Femto.features', (exports) ->
  exports.autoIndent = autoIndent
