var child_process = require('child_process'),
    debug = require('debug')('mediaplayer');

var MediaPlayer = function(options) {
  var self = this;

  if (!options) {
    options = {};
  }

  // The media palyer instance.
  this.player = options.player || 'omxplayer -o hdmi -r';
  debug('New MediaPlayer instance created. Player command set to ' + this.player);

  // Commands to be executed
  this.commands = options.commands || {
    pause: 'p',
    volInc: '=',
    volDec: '-',
    subtitles: 's',
    forward: '$\'\\x1b\\x5b\\x43\'',
    back: '$\'\\x1b\\x5b\\x44\'',
    stop: 'q'
  };

  // The child_process isntance of the player.
  this.process = null;
  // The current resource that is playing
  this.resource = null;

  this.start = function(resource) {
    if (this.process) {
      return this;
    }

    this.resource = resource;

    // If we're dealing with a resource over the internet,
    // Create a fifo.
    if (resource.match(/^http/)) {
      var fifo = './media.stream';
      var cmd = 'rm -rf ' + fifo + ' && mkfifo ' + fifo + ' && wget -q -O ' + fifo + ' "' + resource + '" &';
      this.resource = fifo;
      child_process.exec(cmd);
    }

    debug('method: start.');
    debug('Starting resource: ' + this.resource);
    this.process = child_process.exec(this.player + ' ' + this.resource);

    this.process.on('error', self.reset);
    this.process.on('exit', self.reset);

    return this;
  };

  this.reset = function() {
    debug('method: reset.');
    this.process = null;
    this.resource = null;

    return this;
  };

  this.write = function(command) {
    if (!this.process) {
      return this;
    }

    if (command) {
      this.process.stdin.write(command);
    }

    return this;
  };

  this.stop = function() {
    this.write(this.commands.stop);
    return this.reset();
  };

  this.pause = function() {
    debug('method: pause.');
    return this.write(this.commands.pause);
  };

  this.forward = function() {
    debug('method: forward.');
    return this.write(this.commands.forward);
  };

  this.backward = function() {
    debug('method: backward.');
    return this.write(this.commands.backward);
  };

  this.volInc = function() {
    debug('method: volInc.');
    return this.write(this.commands.volInc);
  };

  this.volDec = function() {
    debug('method: volDec.');
    return this.write(this.commands.volDec);
  };

  this.subtitles = function() {
    debug('method: subtitles.');
    return this.write(this.command.subtitles);
  };

  return this;
};

module.exports = exports = MediaPlayer;