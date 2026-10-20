# log4me
A very simple node js logger that does only one style of logging

## Installation
```
$ npm install --save log4me
```
The log directory (`./log` by default) is created automatically on first use.

## Usage
```
var log = require('log4me');

log.debug("HELLO BOB");
log.fatal("BIG PROBLEM");
log.error("DAMN");
log.setLevel('fatal');
log.warn("Careful");
log.info("Hello");
log.debug("Testing testing 1 2 3");
log.fatal("Oh no");
```
