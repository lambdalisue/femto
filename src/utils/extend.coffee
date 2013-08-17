# Clone object
#
# @param [Object] a an object will be cloned
# @return [Object] an object cloned
# @example
#   a = {'a': 1, 'b': 2}
#   b = clone(a)
clone = (a) ->
  newObj = {}
  for k, v of a
    if a.hasOwnProperty(k)
      newObj[k] = v
  return newObj

# Extend object like jQuery extend method
#
# @param [Object] a an object of user specified values
# @param [Object] b an object of default values
# @return [Object] an object extended with user specified value
# @example
#   a = {'a': 1, 'b': 2}
#   b = {'a': 2}
#   c = extend(b, a)  # -> {'a': 2, 'b': 2}
extend = (a, b) ->
  b = clone(b)
  for k, v of a
    if a.hasOwnProperty(k)
      b[k] = v
  return b

namespace 'Femto.utils', (exports) ->
  exports.clone = clone
  exports.extend = extend
