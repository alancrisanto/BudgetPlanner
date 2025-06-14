import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<>
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
							Start tracking your incomes and expenses, and save money with our easy-to-use budgeting app.
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
				{/* Grid section */}
				<div className="grid lg:grid-cols-3 gap-4 px-4 pt-16 pb-4 items-stretch">
					{/* Card 1 */}
					<div className="flex flex-col justify-between gap-4 rounded-lg bg-[#f6f5f3] px-8 pt-8 shadow-md text-center h-full">
						<h3 className="text-3xl font-bold text-indigo-600">Everything you need to master your money</h3>
						<p>Simple, Smart & Secure</p>
						<div className="mt-auto">
							<img src="/savings-card.jpg" alt="" className="w-full h-auto max-h-64 object-contain" />
						</div>
					</div>

					{/* Card 2: Video & Icons */}
					<div className="flex flex-col h-full justify-between px-4">
						<div className="bg-[#f6f5f3] rounded-3xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
							<div className="rounded-full bg-white p-2 shadow-md hover:shadow-lg transition">
								<img src="/finance-card.svg" alt="" />
							</div>
							<div className="rounded-full bg-white p-2 shadow-md hover:shadow-lg transition">
								<img src="/finance-bar.svg" alt="" />
							</div>
							<div className="rounded-full bg-white p-2 shadow-md hover:shadow-lg transition">
								<img src="/finance-coin.svg" alt="" />
							</div>
							<div className="rounded-full bg-white p-2 shadow-md hover:shadow-lg transition">
								<img src="/reload.svg" alt="" />
							</div>
						</div>
						<div className="w-full rounded-lg h-full">
							<video
								src="/video.mp4"
								autoPlay
								loop
								muted
								playsInline
								className="rounded-3xl w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* Card 3: Phone Image */}
					<div className="flex items-end justify-center h-full bg-indigo-400 rounded-lg p-4">
						<img className="max-h-80 h-full object-fill" src="/phone.png" alt="Phone" />
					</div>
				</div>

				<div className="grid grid-cols-5 gap-4 px-4">
					<div className="col-span-5 lg:col-span-2 bg-indigo-400 rounded-lg p-8 shadow-md">
						<div className="flex items-start">
							<img className="max-w-6" src="star.svg" alt="" />
							<img className="max-w-6" src="star.svg" alt="" />
							<img className="max-w-6" src="star.svg" alt="" />
							<img className="max-w-6" src="star.svg" alt="" />
							<img className="max-w-6" src="star.svg" alt="" />
						</div>
						<p className="text-md py-2 text-white">
							"Don't know where your money is going? With this app, you can get your family budget in order."
						</p>
						<p className="text-sm text-white">- Gorchakov, App Store Slide 2 of 3.</p>
					</div>
					<div className="col-span-5 lg:col-span-3 bg-[#f6f5f3] rounded-lg p-8 shadow-md">
						<h3 className="text-2xl font-bold text-indigo-600 pb-2">Track your monthly spending and more</h3>
						<p>
							Review your transactions, track your spending by category and receive monthly insights that help you
							better understand your money habits.
						</p>
					</div>
				</div>
				{/* Newsletter */}
				<div className="flex items-center justify-center px-4 py-16">
					<div className="text-center max-w-3xl">
						<h1 className="text-5xl sm:text-4xl font-bold text-indigo-800 leading-tight">
							<span className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 to-indigo-500">
								Subscribe to our newsletter and get Weekly budgeting tips directly in your inbox
							</span>
						</h1>
						<p className="text-zinc-600 mt-4">
							Get amazing tips and tricks to help you succeed on your budgeting adventure. No spam, just valuable
							learning.
						</p>

						<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2">
							<input
								type="email"
								placeholder="Your email address..."
								className="w-full sm:w-[400px] px-4 py-3 rounded-md border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
							/>
							<button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md">Submit</button>
						</div>

						<p className="text-sm text-indigo-700 mt-4">
							By subscribing you accept our <span className="underline cursor-pointer"><a href="/TermsOfService">Terms of Service</a></span> and{" "}
							<span className="underline cursor-pointer"><a href="/PrivacyPolicy">Privacy Policy</a></span>.
						</p>
					</div>
				</div>
			</div>
		</section>
	
		</>
		);
}

export default Home;
