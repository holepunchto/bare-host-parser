const test = require('brittle')
const { parse, format, conditions } = require('.')

test('parse', (t) => {
  t.alike(parse('linux-x64'), { platform: 'linux', arch: 'x64', environment: null })
  t.alike(parse('linux-arm64-musl'), { platform: 'linux', arch: 'arm64', environment: 'musl' })
  t.alike(parse('linux-mipsel-muslsf'), {
    platform: 'linux',
    arch: 'mipsel',
    environment: 'muslsf'
  })
  t.alike(parse('ios-x64-simulator'), { platform: 'ios', arch: 'x64', environment: 'simulator' })
  t.alike(parse('darwin-universal'), { platform: 'darwin', arch: 'universal', environment: null })
})

test('parse, architecture with a hyphen', (t) => {
  t.alike(parse('watchos-arm64-32'), { platform: 'watchos', arch: 'arm64-32', environment: null })
  t.alike(parse('watchos-arm64-simulator'), {
    platform: 'watchos',
    arch: 'arm64',
    environment: 'simulator'
  })
})

test('parse, invalid host', (t) => {
  for (const host of [
    '',
    'linux',
    'linux-',
    '-x64',
    'linux-x64-',
    'linux-x64-gnu',
    'linux-sparc',
    'haiku-x64',
    'linux-x64-musl-simulator',
    'Linux-x64',
    null
  ]) {
    t.exception(() => parse(host), /INVALID_HOST/, `rejects ${JSON.stringify(host)}`)
  }
})

test('format', (t) => {
  t.is(format({ platform: 'watchos', arch: 'arm64-32' }), 'watchos-arm64-32')
  t.is(
    format({ platform: 'ios', arch: 'universal', environment: 'simulator' }),
    'ios-universal-simulator'
  )
})

test('format, invalid part', (t) => {
  t.exception(() => format({ platform: 'haiku', arch: 'x64' }), /INVALID_HOST/)
  t.exception(() => format({ platform: 'linux', arch: 'arm64-musl' }), /INVALID_HOST/)
  t.exception(() => format({ platform: 'linux', arch: 'x64', environment: 'gnu' }), /INVALID_HOST/)
})

test('conditions', (t) => {
  t.alike(conditions('watchos-arm64-32'), ['watchos', 'arm64-32'])
  t.alike(conditions('linux-arm64-musl'), ['linux', 'arm64', 'musl'])
})

test('conditions, unknown host', (t) => {
  t.alike(conditions('host'), ['host'])
  t.alike(conditions('host-a-b'), ['host', 'a', 'b'])
})
