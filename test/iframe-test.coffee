describe 'Femto.widget.IFrame', ->
  IFrame = Femto.widget.IFrame
  textarea = instance = null

  before ->
    instance = IFrame()
    $(document.body).append instance
    instance.init()

  it 'should return jQuery instance', ->
    expect(instance).to.be.a(jQuery)

  expected_css = [
    ['margin', '']
    ['padding', '']
    ['border', '']
    ['outline', '']
    ['resize', 'none']
    ['overflow', 'scroll']
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

  describe '#init() -> instance', ->
    it 'should return the instance', ->
      r = instance.init()
      expect(r).to.be.eql(instance)

  describe '#write() -> instance', ->
    it 'should return the instance', ->
      r = instance.write("")
      expect(r).to.be.eql(instance)

    it 'should update document body', ->
      instance.document.body.innerHTML = ""
      expect(instance.document.body.innerHTML).to.be.eql("")

      instance.write("Hello World")
      expect(instance.document.body.innerHTML).to.be.eql("Hello World")

      instance.write("<b>Hello</b>")
      expect(instance.document.body.innerHTML).to.be.eql("<b>Hello</b>")

    it 'should overwrite all target property of anchor links', ->
      instance.write("<a>Hello</a>")
      expect(instance.document.body.innerHTML)
        .to.be.eql("<a target=\"_blank\">Hello</a>")
      instance.write("<a>Hello</a><a target=\"_top\">World</a>")
      expect(instance.document.body.innerHTML)
        .to.be.eql("<a target=\"_blank\">Hello</a><a target=\"_blank\">World</a>")
