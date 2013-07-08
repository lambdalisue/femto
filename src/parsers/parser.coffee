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
  constructor: (@url, @type='GET', @dataType='text') ->
    super(@fn, false)

  data: (value) ->
    return {'data': value}

  fn: (value, done) =>
    jQuery.ajax(
      'url': @url
      'type': @type
      'dataType': @dataType
      'data': @data(value)
    ).done( (data, textStatus, jqXHR) ->
      done data
    ).fail( (jqXHR, textStatus, errorThrown) ->
      done errorThrown
    )

namespace 'Femto.parsers', (exports) ->
  exports.Parser = Parser
  exports.AjaxParser = AjaxParser
