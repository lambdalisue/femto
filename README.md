femto [![Build Status](https://travis-ci.org/lambdalisue/femto.png)](https://travis-ci.org/lambdalisue/femto)
================================================================================

A well tested simple and powerful web based text editor.

**femto** allow you to add a simple and powerful text editor on your web site.
It is assumed to use for writing a Markup text.
It helps user to write these kind of text with the following features:

-	[x] `TAB` indent and `SHIFT + TAB` outdent

	`TAB` key move the focus to the next object in browser default `textarea`.
	However most desktop text editor use `TAB` key for indent.

-	[x] Auto indent (Keep indent)

	Some desktop text editor automatically keep indent level when user hit
	`RETURN` key. It is useful when user write a kind of Markup text which use
	indent as a blockquote or code block.

-	[ ] Smart indent (plugin)

	With `smartIndent` plugin, femto automatically insert a Markup specified
	leading characters like `>` in Markdown or `#.` in reStructuredText.
	It has not developed yet.

-	[ ] Preview panel (plugin)

	With `previewPanel` plugin, femto add preview panel to check the output of
	the current text.
	It has not developed yet.

-	[ ] Fullscreen (plugin)

	With `fullscreen` plugin, user can use femto in fullscreen mode.
	It has not developed yet.

-	[ ] Mobile support (plugin)

	With `mobile` plugin, user can use femto in smart phone like iPhone.
	It has not developed yet.

-	[ ] Attachment (plugin)

	With `attachment` plugin, user can attach files like Image or Zip to the
	text. It use some free upload services or user specified upload services to
	store files.
	It has not developed yet.

Usage
--------------------------------------------------------------------------------
femto is under developped yet. If you want to try femto, you can follow the
steps below:

1.	Clone git repository on your hard disc with

		% git clone https://github.com/lambdalisue/femto.git
		% cd femto

2.	Install required library to build femto with

		% npm install

3.	Build femto with

		% ./node_modules/coffee-script/bin/cake release

4.	Copy and rename `app.js` and `app.css` to your project

		% mkdir -p ~/femto
		% copy ./www/js/app.js ~/femto/femto.0.0.0.js
		% copy ./www/css/app.css ~/femto/femto.0.0.0.css

5.	Write HTML as:

		<html>
			<head>
				<link rel="stylesheet" href="femto/femto.0.0.0.css">
			</head>
			<body>
				<textarea id="femto-demo"></textarea>
				<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
				<script src="femto/femto.0.0.0.js"></script>
				<script>
					$(function() {
						var textarea = $('textarea#femto-demo');
						Femto(textarea);
					});
				</script>
			</body>
		</html>

### Disable features of each femto instance

If you want to disable features of each femto instance, follow the steps below:

	var textarea = $('textarea#femto-demo');
	var femto = Femto(textarea);
	# if you want to disable `indent` feature
	femto.plugins.indent.disable();

### Disable features globally

If you want to disable features of all femto instance, follow the steps below:

	# You have to disable features before you make the instance
	del Femto.plugins.indent;
	var textarea = $('textarea#femto-demo');
	Femto(textarea);

Supported browsers
--------------------------------------------------------------------------------
The following browsers are (or will be) supported.

-	[x] Google Chrome
-	[ ] Mozilla Firefox
-	[ ] Safari
-	[ ] Opera
-	[ ] Internet Explorer 8 (and over 8)

Test
--------------------------------------------------------------------------------
You can check the test result at
[femto Travis-ci](https://travis-ci.org/lambdalisue/femto).

License
--------------------------------------------------------------------------------
MIT License

Copyright(c) 2012 lambdalisue, hashnote.net all right reserved.
