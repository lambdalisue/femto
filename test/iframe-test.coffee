describe 'Femto.widget.IFrame', ->
  IFrame = Femto.widget.IFrame
  textarea = instance = null

  before ->
    instance = IFrame()
    $(document).append instance
    instance.init()

  it 'should return jQuery instance', ->
    expect(instance).to.be.a(jQuery)

  expected_css = [
    ['margin', '0']
    ['padding', '0']
    ['border', 'none']
    ['outline', 'none']
    ['resize', 'none']
    ['overflow', 'scroll']
    ['width', '100%']
    ['height', '100%']
  ]
  for [name, value] in expected_css then do (name, value) ->
    it "return instance CSS `#{name}` should be `#{value}`", ->
      expect(instance.css(name)).to.be.eql(value)

  expected_methods = [
    'focus',
    'blur',
    'init',
    'write',
  ]
  for method in expected_methods then do (method) ->
    it "return instance should have `#{method}` method", ->
      expect(instance).to.have.property(method)
      expect(instance[method]).to.be.a('function')

  describe '#focus() -> instance', ->
    it 'should return the instance', ->
      r = instance.focus()
      expect(r).to.be.eql(instance)

  describe '#blur() -> instance', ->
    it 'should return the instance', ->
      r = instance.blur()
      expect(r).to.be.eql(instance)
