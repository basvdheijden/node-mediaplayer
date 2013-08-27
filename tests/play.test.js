var MediaPlayer = require('../index');

var play = function(test, path, t) {
	test.expect(3);

	var mediaPlayer = MediaPlayer.getInstance();
	test.ok(mediaPlayer, 'mediaPlayer instance must exist');

	mediaPlayer.start(path);
	setTimeout(function() {
		test.ok(mediaPlayer.resource === path, 'After 2 secs, mediaPlayer should be playing the mp4 file');

		mediaPlayer.stop();
		test.ok(!mediaPlayer.process, 'After calling stop, the media file should not be playing anymore.');

		setTimeout(function() {
			test.done();
		}, 1000);
	}, t);
};

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

  playMP4: function(test) {
    play(test, __dirname + '/sample.mp4', 2000);
  },

  playHTTP: function(test) {
  	play(test, 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', 5000);
  },

  playTwice: function(test) {
    test.expect(3);

    var mediaPlayer = MediaPlayer.getInstance();
    mediaPlayer.start(__dirname + '/sample.mp4');
    setTimeout(function() {
      test.ok(!mediaPlayer.process, 'The process should\'ve been stopped by now.');
      test.ok(!mediaPlayer.resource, 'The resource should be empty by now.');

      mediaPlayer.start(__dirname + '/sample.mp4');

      setTimeout(function() {
        test.ok(mediaPlayer.process, 'Mediaplayer should play a second file sequentially.');
        test.done();
      }, 1000);
    }, 10000);
  },

  playInterrupt: function(test) {
    test.expect(3);

    var path = __dirname + '/sample.mp4';
    var mediaPlayer = MediaPlayer.getInstance();
    mediaPlayer.start(path);

    setTimeout(function() {
      test.ok(mediaPlayer.resource === path, 'After 2 secs, mediaPlayer should be playing the mp4 file');

      mediaPlayer.start(path);

      test.ok(!mediaPlayer.resource, 'The next file should not be playing yet, but the previous one has to be stopped already.');

      setTimeout(function() {
        test.ok(mediaPlayer.resource === path, 'After 1 sec more, mediaPlayer should be playing the mp4 file');
        mediaPlayer.stop();
        test.done();
      }, 1500);
    }, 2000);
  }
};