import React from "react";

function FeedbackCard({ rating, review, username, title, className }) {
	return (
		<div className={`${className}`}>
			<div className="flex flex-col justify-start items-start h-64">
				<div className="flex flex-row gap-2 justify-center items-center">
					<img
						src="/src/assets/icons/star.svg"
						alt="yellow star icon"
						className="w-6 h-6"
					/>
					<h4 className="text-accent font-medium">{rating}</h4>
				</div>
			</div>
		</div>
	);
}

export default FeedbackCard;
