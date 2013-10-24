var child_process = require('child_process'),
    debug = require('debug')('mediaplayer');

var MediaPlayer = function(options) {
  var self = this;

  if (!options) {
    options = {};
  }

  // The media player instance.
  this.player = options.player || 'omxplayer -o hdmi -r';
  debug('New MediaPlayer instance created. Player command set to ' + this.player);

  // Commands to be executed
  this.commands = options.commands || {
    pause: 'p',
    volInc: '=',
    volDec: '-',
    subtitles: 's',
    subtitleNext: 'm',
    subtitlePrev: 'n',
    forward: "\u001b[C",
    backward: "\u001b[D",
    stop: 'q'
  };

  this.fifo = (typeof options.fifo !== 'undefined') ? options.fifo : './media.stream';

  // The period of time to let the player cooldown from a stop command.
  this.coolDown = options.cooldown || 100;

  // The child_process isntance of the player.
  this.process = null;
  // The current resource that is playing
  this.resource = null;

  this.start = function(resource, title, arg) {
    if (this.process) {
      this.stop();

      setTimeout(function() {
        self.start(resource, title);
      }, self.coolDown);

      return this;
    }

    debug('method: start.');

    this.resource = resource;
    var localResource;

    // If we're dealing with a resource over the internet,
    // Create a fifo.
    if (this.fifo && resource.match(/^http/)) {
      var cmd = 'rm -rf ' + this.fifo + ' && mkfifo ' + this.fifo + ' && wget -q -O ' + this.fifo + ' "' + resource + '" &';

      // Set the resource to the fifo instead of the file requested.
      this.resource = localResource = this.fifo;
      debug('starting http with: ' + cmd);
      child_process.exec(cmd);
    }
    else {
      // We're dealing with a local file: quote the file path.
      localResource = '"' + this.resource.replace('"', '\\"') + '"';
    }

    // If any command line arguments are given, pass them on.
    var components = [this.player];
    if (arg) {
      components.push(arg);
    }
    components.push(localResource);
    var command = components.join(' ');

    debug('Starting resource: ' + command);
    this.process = child_process.exec(command);

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
      this.process.kill('SIGINT');
      child_process.exec('killall -9 ' + this.player.split(' ')[0]);
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
    return this.write(this.commands.subtitles);
  };

  this.subtitlePrev = function() {
    debug('method: subtitlePrev');
    return this.write(this.commands.subtitlePrev);
  };

  this.subtitleNext = function() {
    debug('method: subtitleNext');
    return this.write(this.commands.subtitleNext);
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
