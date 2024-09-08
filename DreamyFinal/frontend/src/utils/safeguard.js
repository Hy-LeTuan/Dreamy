function safeguardFromSpecialChars(str) {
	const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
	return specialChars.test(str);
}

function safeguardFromWrongEmailFormat(email) {
	if (email.includes("@")) {
		const [first_part, second_part] = email.split("@");

		// check for empty parts after splitting
		if (!first_part || !second_part) {
			return true;
		}
		// check for invalid link
		else if (!second_part.includes(".com")) return true;
		else return false;
	} else {
		return true;
	}
}

export { safeguardFromSpecialChars, safeguardFromWrongEmailFormat };
