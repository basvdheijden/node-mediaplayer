var MediaPlayer = require('../index');

module.exports = {
  setUp: function(callback) {
    var m = MediaPlayer.getInstance();
    m.player = 'mplayer';
    m.fifo = false;

    callback();
  },

  tearDown: function(callback) {
    callback();
  },

  mainTest: function(test) {
    test.expect(2);

    var mediaPlayer = MediaPlayer.getInstance();
    var path = __dirname + '/sample.mp4';

    test.ok(typeof mediaPlayer === 'object', 'MediaPlayer should exist');
    mediaPlayer.start(path, 'Sample', ['-nosound']);

    setTimeout(function() {
      test.ok(mediaPlayer.resource === 'Sample', 'After 1 sec more, mediaPlayer should be playing the mp4 file with a title of \'Sample\' giving no sound output');
      mediaPlayer.stop();
      setTimeout(function() {
        test.done();
      }, 2000);
    }, 3000);
  }
};