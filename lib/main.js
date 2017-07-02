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

/* istanbul ignore next: umd wrapper */
(function (root, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }

}(this, factory));

function factory()
{

  'use strict';

  return function(log)
  {
    
    var fn_orig_method_factory = log.methodFactory;

    log.methodFactory = function(method_name, log_level, logger_name)
    {

      var fn_raw_method = fn_orig_method_factory(method_name, log_level, logger_name);

      return function() {

        var args = [];
       
        this.messageBuffer = this.messageBuffer || [];
        this.flush = this.flush || function()
        {
          
          this.messageBuffer.forEach(function(logMessage) {
            logMessage();
          });
          this.messageBuffer = [];
          
        };

        for (var i = 0;i < arguments.length; i++) {
          args.push(arguments[i]);
        }        

        this.messageBuffer.push(function() {
          fn_raw_method.apply(this, args);
        });
      };

    };

    log.setLevel(log.getLevel());

    return log;
    
  };

}
