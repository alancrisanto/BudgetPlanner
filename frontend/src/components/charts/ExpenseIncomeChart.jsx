import { Chart } from "react-google-charts";

function cumulativeDailyData(transactions, selectedDate) {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    // Filter transactions for current month and year
    const filtered = transactions
        .filter((tsx) => {
            const d = new Date(tsx.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    let cumulativeIncome = 0;
    let cumulativeExpense = 0;

    const dayMap = new Map();

    // Iterate through filtered transactions and calculate cumulative totals
    // for each day of the month
    for (let tsx of filtered) {
        const day = new Date(tsx.date).getDate();
        if (!dayMap.has(day)) {
            dayMap.set(day, { income: cumulativeIncome, expense: cumulativeExpense });
        }

        if (tsx.type === "income") {
            cumulativeIncome += tsx.amount;
        } else if (tsx.type === "expense") {
            cumulativeExpense += tsx.amount;
        }

        // Update the current day's totals
        dayMap.set(day, { income: cumulativeIncome, expense: cumulativeExpense });
    }

    const sortedDays = [...dayMap.entries()].sort(([a], [b]) => a - b);

    // Format for Google Charts
    const data = [["Day", "Cumulative Expenses", "Cumulative Income"]];
    for (const [day, values] of sortedDays) {
        data.push([`${day}`, values.expense, values.income]);
    }

    return data;
}


const ExpenseIncomeChart = ({ transactions, selectedDate }) => {
    const data = cumulativeDailyData(transactions, selectedDate);

    const options = {
        hAxis: { title: "Day" },
        vAxis: { title: "Cumulative Amount ($)" },
        legend: { position: "bottom" },
    };

    // Ensure the data has at least one row for the chart to render
    if (data.length <= 1) {
        return (
        <div className="w-full h-32 flex items-center justify-center">
            <p className="text-gray-500 text-center">No data available.</p>
        </div>
        );
    }

    return (
        <div className={"w-full h-96 flex items-center justify-center"}>
            <Chart
                chartType="LineChart"
                width="100%"
                height="100%"
                data={data}
                options={options}
            />
        </div>
    );
};

export default ExpenseIncomeChart;