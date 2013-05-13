femto [![Build Status](https://travis-ci.org/lambdalisue/femto.png)](https://travis-ci.org/lambdalisue/femto)
================================================================================

A well tested simple and powerful web based text editor (Version: 0.1.0).

**femto** allow you to add a simple and powerful text editor on your web site.
It is assumed to use for writing a Markup text.
It helps user to write these kind of text with the following features:

-   Preview panel (bundle)

    femto has a preview panel to check the output of the current text.
    It is under developping now

-   DocumentType (bundle)

    femto can treat different types of document such as Markdown, Textile or so
    on. See Usage for more detail.

-   `TAB` indent and `SHIFT + TAB` outdent (features)

    `TAB` key move the focus to the next object in browser default `textarea`.
    However most desktop text editor use `TAB` key for indent.

-   Auto indent (Keep indent) (features)

    Some desktop text editor automatically keep indent level when user hit
    `RETURN` key. It is useful when user write a kind of Markup text which use
    indent as a blockquote or code block.

-   Smart indent (plugin)

    With `smartIndent` plugin, femto automatically insert a Markup specified
    leading characters like `>` in Markdown or `#.` in reStructuredText.
    It has not developed yet.

-   Fullscreen (plugin)

    With `fullscreen` plugin, user can use femto in fullscreen mode.
    It has not developed yet.

-   Mobile support (plugin)

    With `mobile` plugin, user can use femto in smart phone like iPhone.
    It has not developed yet.

-   Attachment (plugin)

    With `attachment` plugin, user can attach files like Image or Zip to the
    text. It use some free upload services or user specified upload services to
    store files.
    It has not developed yet.

Usage
--------------------------------------------------------------------------------
femto is under developped yet. If you want to try femto, you can follow the
steps below:

1.  Clone git repository on your hard disk with


    ```sh
    % git clone https://github.com/lambdalisue/femto.git
    % cd femto
    ```

2.  Install required library to build femto with

    ```sh
    % npm install
    ```

3.  Build femto with

    ```sh
    % ./node_modules/coffee-script/bin/cake release
    ```

4.  Copy and rename `femto.js` and `femto.css` to your project

    ```sh
    % mkdir -p ~/femto
    % copy ./www/js/femto.js ~/femto/femto.js
    % copy ./www/css/femto.css ~/femto/femto.css
    ```

5.  Write HTML as:

    ```html
    <html>
        <head>
            <link rel="stylesheet" href="femto/femto.css">
        </head>
        <body>
            <textarea id="femto-demo"></textarea>
            <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
            <script src="femto/femto.js"></script>
            <script>
                $(function() {
                    var textarea;
                    textarea = $('textarea#femto-demo');
                    textarea = Femto.transform(textarea);
                });
            </script>
        </body>
    </html>
    ```

### Disable features of each femto instance

If you want to disable features of each femto instance, follow the steps below:

```javascript
var textarea;
textarea = $('textarea#femto-demo');
textarea = Femto.transform(textarea);
// if you want to disable `indent` feature
textarea.features.indent.disable();
```

### Disable features globally

If you want to disable features of all femto instance, follow the steps below:

```javascript
// You have to disable features before you make the instance
del Femto.features.indent;
var textarea;
textarea = $('textarea#femto-demo');
textarea = Femto.transform(textarea);
```

### Enable Markup language

You can use any external libraries to convert markup into html.

See the sample code below ([chjj/marked](<https://github.com/chjj/marked),
[borgar/textile.js](https://github.com/borgar/textile-js) and
[nitoyon/text-hatena.js](https://github.com/nitoyon/text-hatena.js) are used in
the following code.)

```html
<!-- marked by chjj -->
<script src="https://raw.github.com/chjj/marked/master/lib/marked.js"></script>
<!-- textile-js by borgar -->
<script src="https://raw.github.com/borgar/textile-js/master/lib/textile.js"></script>
<!-- text-hatena.js by nitoyon -->
<script src="https://raw.github.com/nitoyon/text-hatena.js/master/text-hatena.js"></script>
<script src="femto/femto.js"></script>
<script>
    $(function() {
        var markdown_filter = function(text) {
            marked.setOptions({gfm: false, tables: false, breaks: false});
            return marked(text);
        };
        var gfm_filter = function(text) {
            marked.setOptions({gfm: true, tables: true, breaks: true});
            return marked(text);
        };
        var textile_filter = textile;
        var hatena_filter = function(text) {
            var parser = new TextHatena();
            return parser.parse(text);
        };
        var options = {
            documentTypes: {
            'markdown': markdown_filter,
            'gfm': gfm_filter,
            'textile': textile_filter,
            'Hatena': hatena_filter
            }
        };
        var femto;
        femto = $('textarea#femto');
        femto = Femto.transform(femto, options);
    }
</script>
```

Supported browsers
--------------------------------------------------------------------------------
The following browsers are supported (or Not Tested yet).

- &#x2713; Google Chrome
- &#x2713; Mozilla Firefox
- &#x2713; Safari
- &#x2713; Lunascape
- &#x2713; Opera
- NT Internet Explorer 10
- NT Internet Explorer 9
- &#x2713; Internet Explorer 8 (limited)
- &#x2713; Internet Explorer 7 (limited)
- &#x2713; Internet Explorer 6 (limited)

Test
--------------------------------------------------------------------------------
You can check the test result at
[femto Travis-ci](https://travis-ci.org/lambdalisue/femto).

Develop
--------------------------------------------------------------------------------
femto is not stable yet. Features might be changed in future.

- [femto API documentation](http://coffeedoc.info/github/lambdalisue/femto/master/)

License
--------------------------------------------------------------------------------
MIT License

Copyright(c) 2012 lambdalisue, hashnote.net all right reserved.
