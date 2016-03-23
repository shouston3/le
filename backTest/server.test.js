var tape = require('tape')
var server = require('../back/server.js')

tape('Does server respond successfully with the index?', (t) => {
  server.inject({method: 'GET', url: '/'}, (res) => {
    t.equal(res.statusCode, 200, 'Server responds with statusCode: 200')
    t.equal(res.result.error, undefined, 'Server has no errors')
    t.ok(res.payload.match('<!DOCTYPE html>'), 'file starts with <!DOCTYPE html>')
    t.ok(res.payload.match('id="container"'), 'index contains the container id')
    t.ok(res.payload.match('<script src="app.js">'), 'index is linking to app.js')
    t.end()
  })
})

tape('wrong endpoint is error handled correctly', (t) => {
  server.inject({method: 'GET', url: '/notanendpoint'}, (res) => {
    t.equal(res.statusCode, 404, 'Server endpoint is not found')
    t.equal(res.result.error, 'Not Found', 'Server has no errors')
    t.end()
  })
})

tape('wrong method is error handled correctly', (t) => {
  server.inject({method: 'NOTMETHOD', url: '/'}, (res) => {
    t.equal(res.statusCode, 404, 'Server endpoint is not found')
    t.equal(res.result.error, 'Not Found', 'Server endpoint is not found')
    t.end()
  })
})

tape('wrong method is error handled correctly', (t) => {
  server.inject({method: 'GET', url: '/', simulate: {error: true}}, (res) => {
    t.equal(res.result.error, undefined, 'Server endpoint is not found')
    t.end()
  })
})

tape('wrong method is error handled correctly', (t) => {
  server.inject({method: 'GET', url: '/', simulate: {error: true}}, (res) => {
    t.equal(res.result.error, undefined, 'Server endpoint is not found')
    t.end()
  })
})