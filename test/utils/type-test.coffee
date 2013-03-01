describe 'Femto.utils.type', ->
  type = Femto.utils.type
  cases = [
    [0,         'number']
    [1.2,       'number']
    [[0, 1],    'array']
    [new Array, 'array']
    [{0: 1},    'object']
    [null,      'null']
    [undefined, 'undefined']
    [NaN,       'number']
  ]

  for [obj, result] in cases then do (obj, result) ->
    it "should return '#{result}' for `#{obj}`", ->
      expect(type obj ).to.be.eql(result)
