import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Home() {
	return (
		<>
			<Helmet>
				<title>Home | Budget Planner</title>
				<meta name="description" content="Plan your budget effectively with BudgetPlanner. Manage expenses, income, and more!" />
				<meta name="keywords" content="budget planner, money manager, expense tracker, personal finance" />
				<meta name="author" content="Veihi Joy Tupai,  Cameron Pedro, _Rama Krishna Bhagi Perez, Bamutesiza Ronald" />

				{/* Social Media SEO */}
				<meta property="og:title" content="BudgetPlanner | Home" />
				<meta property="og:description" content="Plan your budget effectively with BudgetPlanner." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="" />
				<meta property="og:image" content="" />

				{/* Twitter SEO */}
				<meta name="twitter:title" content="BudgetPlanner | Home" />
				<meta name="twitter:description" content="Plan your budget effectively with BudgetPlanner." />
				<meta name="twitter:card" content="" />
				<meta name="twitter:image" content="" />
			</Helmet>
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
	
		</>
		);
}

export default Home;
