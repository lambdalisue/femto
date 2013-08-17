describe 'Femto.utils.typeOf', ->
  typeOf = Femto.utils.typeOf

  it 'should return "null" for null', ->
    r = typeOf(null)
    expect(r).to.be.eql("null")

  it 'should return "undefined" for undefined', ->
    r = typeOf(undefined)
    expect(r).to.be.eql("undefined")

  it 'should return "array" for `[]`', ->
    r = typeOf([])
    expect(r).to.be.eql("array")

  it 'should return "array" for `new Array()`', ->
    r = typeOf(new Array())
    expect(r).to.be.eql("array")

  it 'should return "number" for `0`', ->
    r = typeOf(0)
    expect(r).to.be.eql("number")

  it 'should return "number" for `0.1`', ->
    r = typeOf(0.1)
    expect(r).to.be.eql("number")

  it 'should return "number" for `1.0e4`', ->
    r = typeOf(1.0e4)
    expect(r).to.be.eql("number")

  it 'should return "number" for `0o777`', ->
    r = typeOf(0o777)
    expect(r).to.be.eql("number")

  it 'should return "number" for `0xff`', ->
    r = typeOf(0xff)
    expect(r).to.be.eql("number")

  it 'should return "number" for `new Number()`', ->
    r = typeOf(new Number())
    expect(r).to.be.eql("number")

  it 'should return "number" for `Number.NaN`', ->
    r = typeOf(Number.NaN)
    expect(r).to.be.eql("number")

  it 'should return "string" for `"foo"`', ->
    r = typeOf("foo")
    expect(r).to.be.eql("string")

  it 'should return "string" for `\'foo\'`', ->
    r = typeOf('foo')
    expect(r).to.be.eql("string")

  it 'should return "string" for `new String()`', ->
    r = typeOf(new String())
    expect(r).to.be.eql("string")

  it 'should return "function" for function', ->
    foo = -> @
    r = typeOf(foo)
    expect(r).to.be.eql("function")

  it 'should return "function" for anonymous function', ->
    r = typeOf(->@)
    expect(r).to.be.eql("function")

  it 'should return "function" for `new Function()`', ->
    r = typeOf(new Function())
    expect(r).to.be.eql("function")

  it 'should return "object" for `{}`', ->
    r = typeOf({})
    expect(r).to.be.eql("object")

  it 'should return "object" for class instance', ->
    f = -> @
    r = typeOf(new f())
    expect(r).to.be.eql("object")

  it 'should return "boolean" for `true`', ->
    r = typeOf(true)
    expect(r).to.be.eql("boolean")

  it 'should return "boolean" for `false`', ->
    r = typeOf(false)
    expect(r).to.be.eql("boolean")

  it 'should return "boolean" for `new Boolean()`', ->
    r = typeOf(new Boolean())
    expect(r).to.be.eql("boolean")
