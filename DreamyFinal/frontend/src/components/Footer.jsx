import React from "react";

function Footer() {
	return (
		<div className="bg-primary w-full px-16 py-8">
			<div className="flex flex-row justify-between items-start gap-20">
				<div className="flex flex-col flex-1 basis-0 gap-3">
					<h3 className="font-medium">
						About{" "}
						<span className="text-accent italic font-bold">
							Dreamy
						</span>
					</h3>
					<div>
						<p>
							Dreamy started out as a Hackathon project for the
							Steamhacks Hackathon 2023 in Vietnam. After the
							competition, our team each went our separate ways to
							gather knowledge until it's time to bring Dreamy to
							life once more.
						</p>
					</div>
				</div>
				<div className="flex flex-col flex-1 basis-0 gap-3">
					<h3 className="font-medium">Contact Us</h3>
					<div>
						<p>
							Please contact{" "}
							<span className="text-accent italic font-bold">
								Dreamy{" "}
							</span>
							team through our <a href="">email</a> to receive
							detailed customer support on any problem you are
							facing. We will surely reply as fast as we can.
						</p>
					</div>
				</div>
				<div className="flex flex-row justify-center items-start gap-24 flex-1 basis-0">
					<div className="flex flex-col justify-center">
						<h3 className="font-medium">Products</h3>
						<div>
							<p>Record</p>
						</div>
					</div>
					<div className="flex flex-col justify-center">
						<h3 className="font-medium">Sitemap</h3>
					</div>
				</div>
			</div>
			<hr className="text-black w-full mx-auto my-16" />
		</div>
	);
}

export default Footer;
