import Dashcoins from "../components/DashCoins";
const Dashboard = () => {
	const user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	return (
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
	);
};

export default Dashboard;
