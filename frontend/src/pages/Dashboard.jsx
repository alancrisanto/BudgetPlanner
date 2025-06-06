import Dashcoins from "../components/DashCoins";
import { Helmet } from "react-helmet-async";
const Dashboard = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	return (
		<>
		 	<Helmet>
        		<title>DashBoard | Budget Planner</title>
				<meta name="description" content="View your financial overview — track income, expenses, savings, and budget performance in one place." />
				<meta name="keywords" content="financial dashboard, budget summary, expense overview, income tracking" />
				<meta name="author" content="Veihi Joy Tupai,  Cameron Pedro, _Rama Krishna Bhagi Perez, Bamutesiza Ronald" />

				<meta property="og:title" content="BudgetPlanner | Dashboard" />
				<meta property="og:description" content="Analyze your finances with an easy-to-read dashboard." />
				<meta property="og:url" content="" />
				<meta property="og:image" content="" />

				<meta name="twitter:card" content="" />
				<meta name="twitter:title" content="BudgetPlanner | Dashboard" />
				<meta name="twitter:description" content="Get a full view of your financial health in one place." />
				<meta name="twitter:image" content="" />
      		</Helmet>
					<div>
			<div className="flex gap-4 items-center pt-6">
				<h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
					Welcome back <strong className="text-indigo-600"> {user ? user.user.email : "User"} </strong>
				</h2>
				<img className="max-w-[48px] animate-bounce" src="/money-wings.svg" alt="" />
			</div>
			<p className="text-gray-700">This is your Financial Overview Report</p>
			<Dashcoins />
		</div>
		
		
		</>
	);
};

export default Dashboard;
