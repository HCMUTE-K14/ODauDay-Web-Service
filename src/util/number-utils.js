const NumberUtils = {}

NumberUtils.random = random;
NumberUtils.random4Digit = random4Digit;

module.exports = NumberUtils;

function random(from, to) {
	return Math.floor(from + Math.random() * to);
}

function random4Digit() {
	return random(1000, 9000);
}