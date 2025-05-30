import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<section className="bg-white">
			<div className="mx-auto w-full max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
				<div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">

					{/* Text Content */}
					<div className="text-center lg:text-left">
						<h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
							Manage Your Expense
							<strong className="block text-indigo-600">Control Your Money</strong>
						</h1>

						<p className="mt-4 text-base text-gray-700 sm:text-lg">
							Start creating a budget, track your expenses, and save money with our easy-to-use budgeting app.
						</p>

						<div className="mt-6 flex justify-center lg:justify-start">
							<Link
								className="inline-block rounded border border-indigo-600 bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
								to="/login"
							>
								Get Started
							</Link>
						</div>
					</div>

					{/* Image */}
					<div className="flex justify-center">
						<img
							src="/expense-tracker.webp"
							alt="Expense Tracker Dashboard"
							className="w-full max-w-md lg:max-w-full h-auto"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Home;
