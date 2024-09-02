import React from "react";
import Header from "../components/Header";
import Section from "../components/Section";
import SimpleCard from "../components/SimpleCard";
import { Button } from "@headlessui/react";
import DynamicBodyCard from "../components/DynamicBodyCard";

function Root() {
	return (
		<>
			<Header />
			<Section color={"mountain"}>
				<div className="w-full flex flex-col justify-center items-center gap-32">
					<div className="flex flex-col gap-4">
						<h1 className="display text-black font-medium text-center">
							Say hello to{" "}
							<span className="text-accent italic font-bold">
								Dreamy
							</span>
							, <br /> Your own lecture companion
						</h1>
						<h4 className="text-center font-medium">
							<span className="italic text-accent font-bold">
								Record,
							</span>{" "}
							<span className="italic text-accent font-bold">
								Trascribe
							</span>{" "}
							and{" "}
							<span className="italic text-accent font-bold">
								Quiz
							</span>{" "}
							yourself on your lectures to ace every exam
						</h4>
					</div>
					<Button
						className={
							"transition-all duration-300 inline-flex items-center justify-center px-36 py-8 bg-accent rounded-lg data-[hover]:scale-105 shadow-black/40 shadow-lg"
						}>
						<h3 className="text-white font-medium">
							<a href="/register">Sign Up</a>
						</h3>
					</Button>
					<div className="flex flex-col">
						<div className="grid grid-cols-3 place-items-stretch gap-36">
							<SimpleCard className={"min-h-full"}>
								<h6 className="font-bold">Dreamy Users</h6>
								<h2 className="font-bold text-accent">8343+</h2>
							</SimpleCard>
							<SimpleCard className={"min-h-full"}>
								<h6 className="font-bold">Transcript Made</h6>
								<h2 className="font-bold text-accent">8343+</h2>
							</SimpleCard>
							<SimpleCard className={"min-h-full"}>
								<h6 className="font-bold">Quizzes Solved</h6>
								<h2 className="font-bold text-accent">8343+</h2>
							</SimpleCard>
						</div>
					</div>
				</div>
			</Section>
			<Section color={"white"}>
				<div className="w-full flex flex-col justify-center items-center gap-8">
					<h1 className="text-black font-medium">
						Learn and memorize{" "}
						<span className="text-accent italic font-bold">
							at your own pace
						</span>
					</h1>
				</div>
				<div className="w-full px-28 grid grid-cols-3 place-items-stretch gap-16 mt-24">
					<DynamicBodyCard
						header={
							<h2 className="text-white font-medium text-center">
								RECORD LECTURES
							</h2>
						}
						hiddenBody={
							<div className="flex flex-col justify-start items-center gap-8">
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-7 h-7"
									/>
									<p className="text-white">
										Record your lectures with a 3 hour
										recording time for the best lesson
										engagement
									</p>
								</div>
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-7 h-7"
									/>
									<p className="text-white">
										Filter out all distractions with our
										nosie filter feature for a better
										recording quality
									</p>
								</div>
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-7 h-7"
									/>
									<p className="text-white">
										Say goodbye to missed information with
										our main subject voice focusing feature
									</p>
								</div>
							</div>
						}
						className={
							"border-2 border-black bg-accent rounded-2xl px-10 py-10 gap-8"
						}>
						<div className="bg-white w-11/12 inline-flex items-center justify-center py-12 rounded-2xl mx-auto group-data-[hover]:opacity-0 delay-200 group-data-[hover]:delay-0 duration-300 transition-all">
							<img
								src="/src/assets/images/microphone.png"
								alt=""
								className="w-32 h-32"
							/>
						</div>
						<hr className="text-white w-11/12 transition-all duartion-300 delay-75 group-data-[hover]:delay-150 group-data-[hover]:-translate-y-48" />
					</DynamicBodyCard>
					<DynamicBodyCard
						header={
							<h2 className="text-white font-medium text-center">
								SUMMARIZE NOTES
							</h2>
						}
						hiddenBody={
							<div className="flex flex-col justify-start items-center gap-6">
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-8 h-8"
									/>
									<p className="text-white">
										Tired of listening to lectures? We can
										transcribe your recordings to text file
									</p>
								</div>
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-8 h-8"
									/>
									<p className="text-white">
										Format your transcription with a clear
										title and body for better readability
									</p>
								</div>
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-8 h-8"
									/>
									<p className="text-white">
										Create summary of all of your notes with
										for a quick overview of your lecture
									</p>
								</div>
							</div>
						}
						className={
							"border-2 border-black bg-accent rounded-2xl px-10 py-10 gap-8"
						}>
						<div className="bg-white w-11/12 inline-flex items-center justify-center py-12 rounded-2xl mx-auto group-data-[hover]:opacity-0 delay-200 group-data-[hover]:delay-0 duration-300 transition-all">
							<img
								src="/src/assets/images/writing.png"
								alt=""
								className="w-32 h-32"
							/>
						</div>
						<hr className="text-white w-11/12 transition-all duartion-300 delay-75 group-data-[hover]:delay-150 group-data-[hover]:-translate-y-48" />
					</DynamicBodyCard>
					<DynamicBodyCard
						header={
							<h2 className="text-white font-medium text-center">
								GEENERATE QUIZZES
							</h2>
						}
						hiddenBody={
							<div className="flex flex-col justify-start items-center gap-6">
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-8 h-8"
									/>
									<p className="text-white">
										Generate quizzes from your lecture notes
										for a deeper understanding
									</p>
								</div>
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-8 h-8"
									/>
									<p className="text-white">
										Generate quizzes from a whole topic for
										a wider knowledge coverage
									</p>
								</div>
								<div className="flex flex-row items-center justify-center gap-3">
									<img
										src="/src/assets/icons/checkmark.svg"
										alt="Checkmark icon"
										className="w-8 h-8"
									/>
									<p className="text-white">
										We offer to save your solution and
										errors for better after exam review
									</p>
								</div>
							</div>
						}
						className={
							"border-2 border-black bg-accent rounded-2xl px-10 py-10 gap-8"
						}>
						<div className="bg-white w-11/12 inline-flex items-center justify-center py-12 rounded-2xl mx-auto group-data-[hover]:opacity-0 delay-200 group-data-[hover]:delay-0 duration-300 transition-all">
							<img
								src="/src/assets/images/ideas.png"
								alt=""
								className="w-32 h-32"
							/>
						</div>
						<hr className="text-white w-11/12 transition-all duartion-300 delay-75 group-data-[hover]:delay-150 group-data-[hover]:-translate-y-48" />
					</DynamicBodyCard>
				</div>
			</Section>
		</>
	);
}

export default Root;
