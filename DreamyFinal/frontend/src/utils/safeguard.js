function safeguardFromSpecialChars(str) {
	const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
	return specialChars.test(str);
}

export { safeguardFromSpecialChars };
