var mediaPlayer;

var play = function(test, path, t) {
	test.expect(3);
	test.ok(mediaPlayer, 'mediaPlayer instance must exist');

	mediaPlayer.start(path);
	setTimeout(function() {
		test.ok(mediaPlayer.resource = path, 'After 2 secs, mediaPlayer should be playing the mp4 file');

		mediaPlayer.stop();
		test.ok(!mediaPlayer.process, 'After calling stop, the media file should not be playing anymore.');

		setTimeout(function() {
			test.done();
		}, 1000);
	}, t);
};

module.exports = {
  setUp: function(callback) {
  	mediaPlayer = require('../index');
  	mediaPlayer.player = 'mplayer';
  	mediaPlayer.fifoEnabled = false;

    callback();
  },

  tearDown: function(callback) {
    callback();
  },

  playMP4: function(test) {
    play(test, __dirname + '/sample.mp4', 2000);
  },

  playHTTP: function(test) {
  	play(test, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', 5000);
  }
};