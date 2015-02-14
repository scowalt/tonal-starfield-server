var Sound = function() {
	var MIN_MIDI = 36;
	var MAX_MIDI = 89;
	var OCTAVE_LENGTH = 12;
	var NUMBER_OF_OCTAVES = 11;
	var SOUND_LENGTH = 3000;
	var key = 0;

	function getRandomPentatonicMIDI() {
		var base_scale = [0, 2, 4, 7, 9];
		var octave = Math.floor(Math.random() * NUMBER_OF_OCTAVES);
		var base_note = base_scale[Math.floor(Math.random() * base_scale.length)] + key;
		var note = octave * OCTAVE_LENGTH + base_note;
		if (note < MIN_MIDI || note > MAX_MIDI) {
			return getRandomPentatonicMIDI();
		}
		return note;
	}

	this.playNote = function playNote(vol) {
		var table = [0, [1, 5],
			[0.25, SOUND_LENGTH / 2],
			[0, SOUND_LENGTH / 2]
		];
		var freq = getRandomPentatonicMIDI().midicps();
		var note = T('sin', {
			freq: freq,
			mul: vol
		});
		var envelope = T('env', {
			table: table
		}, note).on('ended', function() {
			this.pause();
		}).bang().play();
	};

	this.changeKey = function changeKey() {
		key = key + Math.random() * OCTAVE_LENGTH;
		key = key % 12;
	};
};
