spawn = require('child_process').spawn

COFFEE_TOASTER = "node_modules/coffee-toaster/bin/toaster"
MOCHA_PHANTOMJS = "node_modules/mocha-phantomjs/bin/mocha-phantomjs"
CODO = "node_modules/codo/bin/codo"

exec = (file, args, done) ->
  proc = spawn(file, args)
  proc.stdout.on 'data', (data) -> process.stdout.write(data)
  proc.stderr.on 'data', (data) -> process.stderr.write(data)
  proc.on('exit', (code) -> done(code)) if done
  return proc

option '-w', '--watch', 'watch files'

task 'debug', 'compile coffee file', (options) ->
  args = ['-cd', '-f', 'config/debug.toaster.coffee']
  args.push('-w') if options.watch?
  toaster = 'node_modules/coffee-toaster/bin/toaster'
  proc = exec(toaster, args)

task 'develop', 'watches and compiles coffee files', (options) ->
  options.watch = true
  invoke 'debug'

task 'release', 'compile coffee file', (options) ->
  args = ['-c', '-f', 'config/release.toaster.coffee']
  args.push('-w') if options.watch?
  toaster = 'node_modules/coffee-toaster/bin/toaster'
  proc = exec(toaster, args)

task 'docs', 'create document files', ->
  exec(CODO, ['--no-private', '--cautions'])

task 'test', 'run mocha test via phantomjs', ->
  exec(MOCHA_PHANTOMJS, ['www/test.html'])

task 'install', 'install required modules', ->
  exec("npm", ['install'])
