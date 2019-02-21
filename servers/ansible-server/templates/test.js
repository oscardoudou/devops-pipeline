const assert = require('assert');
const expect = require('chai').expect;
const shell = require('shelljs');
const request = require('request');

describe('server', function(){
  describe('#start()', function(){
    it('should start checkbox server on 80', function() {
      // start server
      this.timeout(0);
      shell.exec('pm2 start server.js');
      request('http://192.168.33.200', function (error, response, body) {
        console.log('statusCode', response && response.statusCode);
        assert.equal(response.statusCode, 200);
      })
    })

    it('checking developers.html endpoint', function() {
      this.timeout(0);
      request('http://192.168.33.200/developers.html', function (error, response, body) {
        console.log('statusCode for developers.html', response && response.statusCode);
        assert.equal(response.statusCode, 200);
      }) 
    })
  })
  describe('#stop()', function(){
    it('should stop the checkbox server', function() {

      // stop server
      this.timeout(0);
      shell.exec('pm2 stop server.js');
    })
  })
})
