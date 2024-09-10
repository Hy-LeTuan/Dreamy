import React, { useState } from "react";

function useProgressIndex(tabsNumber) {
	const [progressIndex, setBaseProgressIndex] = useState(0);

	const incrementIndex = () => {
		setBaseProgressIndex((prevIndex) => {
			if (prevIndex < tabsNumber - 1) {
				return prevIndex + 1;
			} else {
				return prevIndex;
			}
		});
	};

	const decrementIndex = () => {
		setBaseProgressIndex((prevIndex) => {
			if (prevIndex > 0) {
				return prevIndex - 1;
			} else {
				return prevIndex;
			}
		});
	};

	return [progressIndex, incrementIndex, decrementIndex];
}

export { useProgressIndex };
