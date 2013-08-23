module.exports = {
  setUp: function(callback) {
    callback();
  },

  tearDown: function(callback) {
    callback();
  },

  mainTest: function(test) {
    test.expect(2);

    var mediaPlayer = require('../index');

    test.ok(typeof mediaPlayer === 'object', 'MediaPlayer should exist');
    test.ok(typeof mediaPlayer.start === 'function', 'MediaPlayer should have a start function.');

    test.done();
  },

  singletonTest: function(test) {
    test.expect(1);

    var value = 'test set player'
    var mediaPlayer = require('../index');
    mediaPlayer.player = value;

    var secondMediaPlayer = require('../index');
    test.ok(secondMediaPlayer.player === value, 'Singleton retrieving should work.');

    test.done();
  }
};