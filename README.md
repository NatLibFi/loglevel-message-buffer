# loglevel Message buffer plugin [![NPM Version](https://img.shields.io/npm/v/@natlibfi/loglevel-message-buffer.svg)](https://npmjs.org/package/loglevel-message-buffer) [![Build Status](https://travis-ci.org/NatLibFi/loglevel-message-buffer.svg)](https://travis-ci.org/NatLibFi/loglevel-message-buffer) [![Test Coverage](https://codeclimate.com/github/NatLibFi/loglevel-message-buffer/badges/coverage.svg)](https://codeclimate.com/github/NatLibFi/loglevel-message-buffer/coverage)

Plugin for [loglevel](https://github.com/pimterry/loglevel) which allows buffering of log messages

## Usage

#### AMD

```javascript

define(['loglevel', 'loglevel-message-buffer'], function(log, loglevelMessageBuffer) {

  loglevelMessageBuffer(log);

  log.warn('TEST');
  // Flushes the buffer and sends all messages forward (NOTE: #flush becomes only available after a message is sent)
  log.flush();

});

```

#### Node.js require

```javascript

var log = require('loglevel');
var loglevelMessageBuffer = require('loglevel-message-buffer');

loglevelMessageBuffer(log);

log.warn('TEST');
  // Flushes the buffer and sends all messages forward (NOTE: #flush becomes only available after a message is sent)
log.flush();

```

## Development 

Clone the sources and install the package using `npm`:

```sh
npm install
```

Run the following NPM script to lint, test and check coverage of the code:

```javascript

npm run check

```

## License and copyright

Copyright (c) 2016-2017 **University Of Helsinki (The National Library Of Finland)**

This project's source code is licensed under the terms of **MIT License**.
