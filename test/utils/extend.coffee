describe 'Femto.utils.clone', ->
  clone = Femto.utils.clone
  DEFAULT =
    'a': 'a'
    'b': 'b'
    'c': 'c'

  it 'should return new object', ->
    cloned = clone(DEFAULT)
    cloned2 = cloned
    cloned['a'] = 1
    cloned['b'] = 2
    cloned['c'] = 3
    # cloned2 is reference
    expect(cloned2['a']).to.be.eql(1)
    expect(cloned2['b']).to.be.eql(2)
    expect(cloned2['c']).to.be.eql(3)
    expect(DEFAULT['a']).to.be.eql('a')
    expect(DEFAULT['b']).to.be.eql('b')
    expect(DEFAULT['c']).to.be.eql('c')

  it 'should return object which has exactly same properties', ->
    cloned = clone(DEFAULT)
    for k, v of DEFAULT
      expect(cloned[k]).to.be.eql(v)

describe 'Femto.utils.extend', ->
  extend = Femto.utils.extend
  DEFAULT =
    'a': 'a'
    'b': 'b'
    'c': 'c'

  it 'should return default when nothing is specified', ->
    options = extend({}, DEFAULT)
    for k, v of DEFAULT
      expect(options[k]).to.be.eql(v)

  it 'should overwrite default when values are specified', ->
    SPECIFIED = {'a': 1, 'b': 2, 'c': 3}
    options = extend(SPECIFIED, DEFAULT)
    for k, v of SPECIFIED
      expect(options[k]).to.be.eql(v)
