femto [![Build Status](https://travis-ci.org/lambdalisue/femto.png)](https://travis-ci.org/lambdalisue/femto)
================================================================================

A minimum featured textarea

**femto** allow you to add a simple text editor for writing some kind of Markup
language.
It helps user to write these kind of text with the following features:

-   `TAB` indent and `SHIFT + TAB` outdent

    `TAB` key move the focus to the next object in browser default `textarea`.
    However most desktop text editor use `TAB` key for indent.

-   Auto indent (Keep indent)

    Some desktop text editor automatically keep indent level when user hit
    `RETURN` key. It is useful when user write a kind of Markup text which use
    indent as a blockquote or code block.

-   Complete Undo/Redo

    femto has its own Undo / Redo feature

Usage
--------------------------------------------------------------------------------

1.  Download [femto-0.2.0.tar.gz](https://raw.github.com/lambdalisue/femto/master/release/femto-0.2.0.tar.gz)
    and extract it

2.  Copy extracted files into `femto` directory like

    ```
    + www
        +- index.html
        +- js
            +- femto
                +- femto-0.2.0.js
                +- femto-0.2.0.css
    ```

3.  Write `index.html` as:

    ```html
    <html>
        <head>
            <link rel="stylesheet" href="js/femto/femto.css">
        </head>
        <body>
            <textarea id="femto-demo"></textarea>
            <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
            <script src="js/femto/femto.js"></script>
            <script>
                $(function() {
                    var options = {};
                    // set options if necessary
                    $('textarea#femto-demo').femto(options);
                });
            </script>
        </body>
    </html>
    ```

### Options

-   `expandTab` - when true, use spaces instead of tab (default: true)
-   `indentLevel` - the number of spaces to describe one indent. it makes sense
    only when `expandTab` is true (default: 4)

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
