'use strict';

const EventEmitter = require('events').EventEmitter;

const Mutex = function ($p) {
  this.$p = $p;
  this.locked = false;
  this.emitter = new EventEmitter();
};

Mutex.prototype.acquire = function () {
  return this.$p(resolve => { // eslint-disable-line consistent-return
    if (!this.locked) {
      this.locked = true;

      return resolve(this);
    }

    const attempt = () => { // eslint-disable-line consistent-return
      if (!this.locked) {
        this.locked = true;
        this.emitter.removeListener('release', attempt);

        return resolve(this);
      }
    };

    this.emitter.on('release', attempt);
  });
};

Mutex.prototype.release = function () {
  this.locked = false;
  setImmediate(() => this.emitter.emit('release'));
};

exports = module.exports = Mutex;
