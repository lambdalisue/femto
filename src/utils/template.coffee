DEFAULT_TEMPLATE = """
<html><head>
  <style>
    body { color: #333; }
  </style>
</head><body>
  <!--CONTENT-->
</body></html>
"""

class Template
  constructor: (@template = null, @templateURI = null) ->

  load: (uri, done, force) ->
    success = (data) =>
      @template = data
      done(data) if done?
    if @templateURI isnt uri or not @template? or force
      @templateURI = uri
      jQuery.ajax url: uri, success: success
    return @

  render: (content, done) ->
    render = (template) =>
      done template.replace(/<!--CONTENT-->/g, content)
      return @
    if not @template? and @templateURI?
      @load(@templateURI, render, true)
      return @
    else if not @template?
      @template = DEFAULT_TEMPLATE
    return render(@template)

namespace 'Femto.utils', (exports) ->
  exports.Template = Template
