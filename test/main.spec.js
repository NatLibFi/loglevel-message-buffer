/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * Plugin for loglevel which allows buffering of log messages
 *
 * Copyright (c) 2016-2017 University Of Helsinki (The National Library Of Finland)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 **/

(function (root, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['chai/chai', 'simple-mock', 'loglevel', '../lib/main'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('chai'), require('simple-mock'), require('loglevel'), require('../lib/main'));
  }

}(this, factory));

function factory(chai, simple, loglevel, initPlugin)
{

  'use strict';

  var expect = chai.expect;

  describe('main', function() {

    function initMockPlugin(log, buffer)
    {

      log.methodFactory = function()
      {
        return function(msg) {
          buffer.push(msg);
        };
      };
      
      log.setLevel(log.getLevel());

    }

    it('Should return the object that was passed in', function() {

      var log = loglevel.getLogger('foobar0');

      expect(initPlugin(log)).to.equal(log);

    });

    it('Should alter #methodFactory', function() {

      var log = loglevel.getLogger('foobar1'),
      fn_orig = log.methodFactory;

      initPlugin(log);

      expect(log.methodFactory).to.not.equal(fn_orig);

    });

    it('Should call #setLevel', function() {

      var log = loglevel.getLogger('foobar2');

      simple.mock(log, 'setLevel');

      initPlugin(log);

      expect(log.setLevel.called).to.be.true /* jshint -W030 */;

    });

    it('Should not log anything', function() {

      var messages = [],
      log = loglevel.getLogger('foobar3');

      initMockPlugin(log, messages);
      initPlugin(log);

      log.error('foobar');
      
      expect(messages).to.have.lengthOf(0);

    });

    it('Should log messages after flushing', function() {

      var messages = [],
      log = loglevel.getLogger('foobar4');

      initMockPlugin(log, messages);
      initPlugin(log);

      log.error('foobar');
      
      expect(messages).to.have.lengthOf(0);

      log.error('foo', 'bar');

      log.flush();

      expect(messages).to.have.lengthOf(2);

    });

    it('Should work both on loglevel object and instances', function() {

      var messages, fn_orig_factory, logger;

      function cleanup()
      {
        loglevel.methodFactory = fn_orig_factory;
        delete loglevel.messageBuffer;
        delete loglevel.flush;
      }

      try {

        messages = [];
        fn_orig_factory = loglevel.methodFactory;

        initMockPlugin(loglevel, messages);
        initPlugin(loglevel);

        loglevel.error('foo');

        logger = loglevel.getLogger('foobar5');

        logger.error('bar');

        loglevel.flush();
        expect(messages).to.eql(['foo']);
                
        logger.flush();
        expect(messages).to.eql(['foo', 'bar']);
        
        logger.error('foo');
        loglevel.error('bar');

        logger.flush();
        expect(messages).to.eql(['foo', 'bar', 'foo']);
        
        loglevel.flush();
        expect(messages).to.eql(['foo', 'bar', 'foo', 'bar']);

        cleanup();
        
      } catch (e) {        
        cleanup();
        throw e;
      }

    });

    it('Should pass context to the next plugin', function() {

      var logger;

      function mockPlugin(logger)
      {

        var fn_orig = logger.methodFactory;

        logger.methodFactory = function()
        {
          return function()
          {
            expect(this).to.not.be.undefined /* jshint -W030 */;
          };
        };

        return logger;

      }
      
      logger = initPlugin(mockPlugin(loglevel.getLogger('foobar')));
      logger.error('foobar');      

    });

  });

}
