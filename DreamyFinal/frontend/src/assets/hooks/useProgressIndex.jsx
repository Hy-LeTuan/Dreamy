import React, { useState } from "react";

function useProgressIndex(tabsNumber) {
	const [progressIndex, setBaseProgressIndex] = useState(0);

	const setProgressIndex = (newState) => {
		setBaseProgressIndex((prevProgressIndex) => {
			if (newState > prevProgressIndex) {
				if (newState <= tabsNumber - 1) {
					return newState;
				}
			} else if (newState < prevProgressIndex) {
				if (newState >= 0) {
					return newState;
				}
			}
			return prevProgressIndex;
		});
	};

	return [progressIndex, setProgressIndex];
}

export { useProgressIndex };
