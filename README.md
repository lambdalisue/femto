femto [![Build Status](https://travis-ci.org/lambdalisue/femto.png)](https://travis-ci.org/lambdalisue/femto)
================================================================================

**femto** is a simple and minimum textarea upgrade library.
It only add the following features but the file size is small (9.6 kB) and well
tested (passed 211 tests).

- Undo and Redo with `Ctrl + Z` and `Ctrl + Shift + Z`
- Indent with `Tab`
- Outdent with `Shift + Tab`

Usage
--------------------------------------------------------------------------------
1.  Download [femto-0.3.0.tar.gz][]
2.  Copy extracted files into js directory like

    ```
    + www
      + index.html
      + js
        + femto-0.3.0.js
    ```
3.  Write index.html as

    ```html
    <!DOCTYPE html>
    <html>
      <body>
        <textarea id="femto"></textarea>
        <script src="js/femto-0.3.0.js"></script>
        <script>
          // or your can use $(function(){});
          window.onload = function() {
            var textarea, options;
            options = {};
            textarea = document.getElementById("femto");
            textarea = Femto.transform(textarea, options);
          };
        </script>
      </body>
    </html>
    ```

### Options

-   `caretaker` -- `true` to enable Undo / Redo feature
-   `indent` -- `true` to enable Indent / Auto indent feature
-   `expandTab` -- `true` to use continuous spaces instead of tab string
-   `indentLevel` -- the number of space for a single indent

Test
--------------------------------------------------------------------------------
You can check the test result at
[femto Travis-ci](https://travis-ci.org/lambdalisue/femto).

Develop
--------------------------------------------------------------------------------
You can read an API documentation at
[femto API documentation](http://coffeedoc.info/github/lambdalisue/femto/master/)

License
--------------------------------------------------------------------------------
MIT License

&copy; 2012-2013 Alisue, hashnote.net

[femto-0.3.0.tar.gz]: https://github.com/lambdalisue/femto/raw/master/release/femto-0.2.2.tar.gz
[femto Travis-ci]: https://travis-ci.org/lambdalisue/femto
[femto API documentation]: http://coffeedoc.info/github/lambdalisue/femto/master/
