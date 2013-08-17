# Return type of the object
#
# @param [Object] obj an object
# @return [String] a type name of the object
# @example
#   typeOf(null) # -> 'null'
#   typeOf(undefined) # -> 'undefined'
#   typeOf([]) # -> 'array'
#   typeOf("") # -> 'string'
#   typeOf(1) # -> 'number'
#   typeOf(->@) # -> 'function'
#   typeOf({}) # -> 'object'
typeOf = (obj) ->
  return "null" if obj is null
  return "undefined" if obj is undefined
  return Object::toString.call(obj).slice(8,-1).toLowerCase()

namespace 'Femto.utils', (exports) ->
  exports.typeOf = typeOf
