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

  this.fifo = (typeof options.fifo !== 'undefined') ? options.fifo : './media.stream';

  // The period of time to let the player cooldown from a stop command.
  this.coolDown = options.cooldown || 500;

  // The child_process isntance of the player.
  this.process = null;
  // The current resource that is playing
  this.resource = null;

  this.start = function(resource, title) {
    if (this.process) {
      this.stop();

      setTimeout(function() {
        self.start(resource, title);
      }, self.coolDown);

      return this;
    }

    debug('method: start.');

    this.resource = resource;

    // If we're dealing with a resource over the internet,
    // Create a fifo.
    if (this.fifo && resource.match(/^http/)) {
      var cmd = 'rm -rf ' + this.fifo + ' && mkfifo ' + this.fifo + ' && wget -q -O ' + this.fifo + ' "' + resource + '" &';
      this.resource = this.fifo;
      debug('starting http with: ' + cmd);
      child_process.exec(cmd);
    }

    debug('Starting resource: ' + this.player + ' ' + this.resource);
    this.process = child_process.exec(this.player + ' ' + this.resource);

    this.process.on('error', self.reset);
    this.process.on('exit', function() {
      debug('Ending player by its own.');
      self.reset();
    });

    // If a human readable title was given, use that as resource instead.
    if (title) {
      this.resource = title;
    }

    return this;
  };

  this.reset = function() {
    debug('method: reset.');
    if (this.process) {
      this.process.kill();
      this.process = null;
    }

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

MediaPlayer.instance = null;
MediaPlayer.getInstance = function(options){
  if (this.instance === null) {
    this.instance = new MediaPlayer(options);
  }

  return this.instance;
};

module.exports = exports = MediaPlayer;