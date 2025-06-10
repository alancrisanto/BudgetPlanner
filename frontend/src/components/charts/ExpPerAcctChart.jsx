import { Chart } from 'react-google-charts';

function weeklyExpensesByAccount(transactions) {
    const today = new Date();
    const startOfWeek = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() - today.getUTCDay()
    ));
    startOfWeek.setUTCHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    const dailyExpenses = {};
    const accountSet = new Set();
    const days = [];

    // Use consistent weekday names based on UTC days
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setUTCDate(startOfWeek.getUTCDate() + i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
        dailyExpenses[day] = {};
        days.push(day);
    }

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date); // assume UTC ISO 8601 string
        if (
            transaction.type === 'expense' &&
            transactionDate >= startOfWeek &&
            transactionDate <= endOfWeek
        ) {
            const accountName = transaction.account_id?.name || 'Unknown Account';
            const day = transactionDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

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

    const accountsList = Array.from(accountSet);
    const chartData = [['Day', ...accountsList]];

    for (const day of days) {
        const row = [day];
        for (const account of accountsList) {
            row.push(dailyExpenses[day][account] || 0);
        }
        chartData.push(row);
    }

    return accountsList.length > 0 ? chartData : null;
}

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

    if (!data) {
        return (
            <div className="w-full h-32 flex items-center justify-center">
                <div className="text-gray-500">No data available.</div>
            </div>
        );
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
};

export default ExpPerAcctChart;
