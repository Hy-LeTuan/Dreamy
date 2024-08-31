import React from "react";
import Header from "../components/Header";
import Section from "../components/Section";
import SimpleCard from "../components/SimpleCard";
import { Button } from "@headlessui/react";

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
								<h2 className="font-bold text-accent">8343</h2>
							</SimpleCard>
							<SimpleCard className={"min-h-full"}>
								<h6 className="font-bold">Transcript Made</h6>
								<h2 className="font-bold text-accent">8343</h2>
							</SimpleCard>
							<SimpleCard className={"min-h-full"}>
								<h6 className="font-bold">Quizzes Solved</h6>
								<h2 className="font-bold text-accent">8343</h2>
							</SimpleCard>
						</div>
					</div>
				</div>
			</Section>
		</>
	);
}

export default Root;
