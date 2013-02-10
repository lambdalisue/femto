###
Better `typeof` method of javascript

@param [Object] obj object you want to check the type
@return [String] type

@example
  > utils.type(1)
  'number'
  > utils.type('1')
  'string'
  > utils.type(new String('1'))
  'string'

@see http://coffeescriptcookbook.com/chapters/classes_and_objects/type-function
###
utils.type = (obj) ->
  if obj == undefined or obj == null
    return String obj
  classToType = new Object
  for name in "Boolean Number String Function Array Date RegExp".split(" ")
    classToType["[object " + name + "]"] = name.toLowerCase()
  myClass = Object.prototype.toString.call obj
  if myClass of classToType
    return classToType[myClass]
  return "object"
