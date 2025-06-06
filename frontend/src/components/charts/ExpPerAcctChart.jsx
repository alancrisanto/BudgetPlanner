import { Chart } from 'react-google-charts';

function weeklyExpensesByAccount (transactions) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Set to the start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0); // Reset time to the start of the day
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the end of the week (Saturday)
    endOfWeek.setHours(23, 59, 59, 999); // Reset time to the end of the day

    // Initialize an object to hold daily expenses per account
    const dailyExpenses = {};
    const accountSet = new Set();
    const days = []

    // Create an array of days in the week
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        dailyExpenses[day] = {};
        days.push(day);
    }
    
    // Iterate through transactions and accumulate expenses per account for each day
    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        if (transaction.type === 'expense' && transactionDate >= startOfWeek && transactionDate <= endOfWeek) {
            const accountName = transaction.account_id?.name || 'Unknown Account';
            const day = transactionDate.toLocaleDateString('en-US', { weekday: 'short' });
            accountSet.add(accountName);
            if (!dailyExpenses[day]) {
                dailyExpenses[day] = {};
            }
            if (!dailyExpenses[day][accountName]) {
                dailyExpenses[day][accountName] = 0;
            }
            dailyExpenses[day][accountName] += Math.abs(parseFloat(transaction.amount));
        }
    });

    // Prepare the data for the chart
    const accountsList = Array.from(accountSet);

    const chartData = [['Day', ...accountsList]];
    for (const day of days) {
        const row = [day];
        for (const account of accountsList) {
            row.push(dailyExpenses[day][account] || 0);
        }
        chartData.push(row);
    }
    
    if (accountsList.length === 0) {
        return null;
    }
    return chartData;
};

const ExpPerAcctChart = ({ transactions }) => {
    const data = weeklyExpensesByAccount(transactions);

    const options = {
		legend: { position: 'bottom', maxLines: 3 },
		chartArea: { width: '80%', height: '65%' },
		hAxis: { title: 'Day of Week' },
		vAxis: { title: 'Expenses' },
		isStacked: false,
		bar: { groupWidth: '60%' },
        colors: ['#ffb74d', '#ba68c8', '#ff7043', '#90a4ae', '#fdd835', '#4dd0e1', '#64b5f6']
    };

    // Ensure the data has at least one row for the chart to render
    if (!data) {
        return (
            <div className="w-full h-32 flex items-center justify-center">
                <div className="text-gray-500">No data available.</div>
            </div>
        )
        
    }

    return (
        <Chart
            chartType="ColumnChart"
            data={data}
            options={options}
            width="100%"
            height="400px"
        />
    );
}

export default ExpPerAcctChart;