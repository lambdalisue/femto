class Parser
  constructor: (fn, sync=true) ->
    @fn = fn
    @sync = sync

  parse: (value, render) ->
    @viewer?.wait()
    if @sync
      translated = @fn(value)
      render(translated)
    else
      @fn value, (translated) -> render(translated)
    @viewer?.done()
    return @


class AjaxParser extends Parser
  constructor: (@url, @fieldName='data', @type='GET', @dataType='text') ->
    fn = (value, done) =>
      data = {}
      data[@fieldName] = value
      jQuery.ajax(
        'url': @url
        'type': @type
        'dataType': @dataType
        'data': data
      ).done( (data, textStatus, jqXHR) ->
        done data
      ).fail( (jqXHR, textStatus, errorThrown) ->
        done errorThrown
      )
    super(fn, false)


namespace 'Femto.parsers', (exports) ->
  exports.Parser = Parser
  exports.AjaxParser = AjaxParser
