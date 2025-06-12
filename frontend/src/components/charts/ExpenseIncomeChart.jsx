import { Chart } from "react-google-charts";

function cumulativeDailyData(transactions) {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    let cumulativeIncome = 0;
    let cumulativeExpense = 0;
    const dayMap = new Map();

    for (let tsx of sorted) {
        const utcDate = new Date(tsx.date);
        if (isNaN(utcDate)) {
            console.error("Invalid date:", tsx.date);
            continue;
        }
        const day = utcDate.toISOString().split('T')[0];

        if (!dayMap.has(day)) {
            dayMap.set(day, { income: cumulativeIncome, expense: cumulativeExpense });
        }

        if (tsx.type === "income") {
            cumulativeIncome += tsx.amount;
        } else if (tsx.type === "expense") {
            cumulativeExpense += tsx.amount;
        }

        dayMap.set(day, { income: cumulativeIncome, expense: cumulativeExpense });
    }

    const sortedDays = [...dayMap.entries()].sort(([a], [b]) => new Date(a + 'Z') - new Date(b + 'Z'));

    const data = [["Date", "Cumulative Expenses", "Cumulative Income"]];
    for (const [day, values] of sortedDays) {
        data.push([new Date(day), values.expense, values.income]);
    }

    return data;
}

const ExpenseIncomeChart = ({ transactions }) => {
    const data = cumulativeDailyData(transactions);

    const options = {
        hAxis: { title: "Date" },
        vAxis: { title: "Cumulative Amounts" },
        legend: { position: "bottom" },
    };

    if (data.length <= 1) {
        return (
            <div className="w-full h-32 flex items-center justify-center">
                <p className="text-gray-500 text-center">No data available.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-96 flex items-center justify-center">
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
