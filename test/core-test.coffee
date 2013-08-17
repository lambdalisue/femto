describe 'Femto.transform(textarea, options) -> instance', ->
  instance = textarea = null

  before ->
    textarea = document.createElement('textarea')
    instance = Femto.transform(textarea)

  describe '@returning value', ->
    it 'should have `femto` property', ->
      expect(instance).to.have.property('femto')

    describe '#femto', ->
      properties = [
        ['originator', Femto.utils.Originator]
        ['caretaker', Femto.utils.Caretaker]
        ['indent', Femto.utils.Indent]
        ['caret', Femto.utils.Caret]
        ['linecaret', Femto.utils.LineCaret]
      ]
      for property in properties
        it "should have `#{property[0]}` property", ->
          expect(instance.femto).to.have.property(property[0])
          if property[1]
            expect(instance.femto[property[0]]).to.be.a(property[1])

      methods = [
        'enable', 'disable'
      ]
      for method in methods
        it "should have `#{method}` method", ->
          expect(instance.femto).to.have.property(method)
          expect(instance.femto[method]).to.be.a('function')
