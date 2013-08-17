###
Cakefile of femto
###
fs = require('fs')
spawn = require('child_process').spawn

#-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
NAME    = "femto"
VERSION = "0.3.0"

HEADER  = """
/*
 * #{NAME}
 *
 * A minimum featured textarea
 *
 * @author Alisue (lambdalisue)
 * @version #{VERSION}
 * @see http://github.com/lambdalisue/femto/
 * @copyright 2013, Alisue, hashnote.net
 *
 */

"""
#-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
exec = (file, args, done) ->
  proc = spawn(file, args)
  proc.stdout.on 'data', (data) -> process.stdout.write(data)
  proc.stderr.on 'data', (data) -> process.stderr.write(data)
  proc.on('exit', (code) -> done(code)) if done
  return proc

option '-w', '--watch', 'watch files'

compile = (options, done) ->
  args = ['-cd', '-f', 'config/app.toaster']
  args.push('-w') if options.watch
  proc = exec(COFFEE_TOASTER, args, done)
task 'compile', 'compile coffee files', (options) ->
  compile(options)

compileTest = (options, done) ->
  args = ['-cd', '-f', 'config/app.test.toaster']
  args.push('-w') if options.watch
  proc = exec(COFFEE_TOASTER, args, done)
task 'compile:test', 'compile coffee files for test', (options) ->
  compileTest(options)

compileLess = (options, done) ->
  exec(LESS, ['-x', 'less/app.less', 'www/css/app.css'], done)
task 'compile:less', 'compile LESS files', (options) ->
  compileLess(options)

compileDocs = (options, done) ->
  exec(CODO, ['--no-private', '--cautions'], done)
task 'compile:docs', 'compile document files', (options) ->
  compileDocs(options)

runTest = (options, done) ->
  exec(MOCHA_PHANTOMJS, ['www/test.html'], done)
task 'test', 'run mocha test via phantomjs', (options) ->
  runTest(options)

task 'install', 'install required modules', ->
  exec("npm", ['install'])

task 'debug', 'compile coffee file', (options) ->
  if options.watch
    watch = true
    options.watch = false
  compile(options, ->
    compileTest(options, ->
      compileLess(options, ->
        runTest(options, ->
          if watch
            options.watch = true
            invoke 'compile'
            invoke 'compile:test'
            invoke 'compile:less'
          )
        )
      )
    )

task 'release', 'compile coffee file', (options) ->
  if options.watch
    watch = true
    options.watch = false
  compile(options, ->
    compileTest(options, ->
      compileLess(options, ->
        runTest(options, (code) ->
          if code != 0
            exit(1)
          else
            copy = (src, dst, header="", footer="") ->
              data = fs.readFileSync src
              fs.writeFileSync dst, "#{header}#{data}#{footer}"
            copy("www/js/app.js", "#{NAME}-#{VERSION}.js", HEADER)
            copy("www/css/app.css", "#{NAME}-#{VERSION}.css", HEADER)
            exec "tar", ['czf', "release/#{NAME}-#{VERSION}.tar.gz",
              "#{NAME}-#{VERSION}.js",
              "#{NAME}-#{VERSION}.css",
              "README.md",
              'doc',
              'www',
            ], ->
              fs.unlinkSync("#{NAME}-#{VERSION}.js")
              fs.unlinkSync("#{NAME}-#{VERSION}.css")
          )
        )
      )
    )

COFFEE_TOASTER  = "node_modules/coffee-toaster/bin/toaster"
MOCHA_PHANTOMJS = "node_modules/mocha-phantomjs/bin/mocha-phantomjs"
CODO            = "node_modules/codo/bin/codo"
LESS            = "node_modules/less/bin/lessc"
