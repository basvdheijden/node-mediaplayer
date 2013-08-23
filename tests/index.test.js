var MediaPlayer = require('../index');


module.exports = {
  setUp: function(callback) {
    callback();
  },

  tearDown: function(callback) {
    callback();
  },

  mainTest: function(test) {
    test.expect(3);

    var mediaPlayer = MediaPlayer.getInstance({
      player: 'randomstring'
    });

    test.ok(typeof mediaPlayer === 'object', 'MediaPlayer should exist');
    test.ok(typeof mediaPlayer.start === 'function', 'MediaPlayer should have a start function.');
    test.ok(mediaPlayer.player === 'randomstring', 'MediaPlayer player value should be "randomstring"');

    test.done();
  },

  singletonTest: function(test) {
    test.expect(2);

    var value = 'test set player';
    var mediaPlayer = MediaPlayer.getInstance();
    test.ok(mediaPlayer.player === 'randomstring', 'Singleton retrieving should work from previous function.');
    mediaPlayer.player = value;

    var secondMediaPlayer = MediaPlayer.getInstance();
    test.ok(secondMediaPlayer.player === value, 'Singleton retrieving should work.');

    test.done();
  },

  instanceTest: function(test) {
    test.expect(2);

    var value = 'test set player2';
    var mediaPlayer = MediaPlayer.getInstance();
    mediaPlayer.player = value;

    var secondMediaPlayer = new MediaPlayer({
      player: 'test set player3'
    });

    test.ok(secondMediaPlayer.player === 'test set player3', 'Normal object initialization should work.');
    test.ok(mediaPlayer.player === value, 'Singleton should be another instance');

    test.done();
  }
};