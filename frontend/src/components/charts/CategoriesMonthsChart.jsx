import { Chart } from "react-google-charts";
import React, { useState } from "react";

const categoryColorMap = {
	Groceries: '#42a5f5',
	Rent:  '#26c6da',
	Utilities: '#ab47bc',
	Takeout: '#66bb6a',
	Transportation: '#ffa726',
	Entertainment: '#ef5350',
	Health: '#d4e157',
	Shopping: '#8d6e63',
	Other: '#fdd835',
};

function calculateCategoryTotalsAllAccountsMonths(transactions, selectedDate) {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const filtered = transactions
        .filter((tsx) => {
            const d = new Date(tsx.date);
            return (
                tsx.type === "expense" &&
                d.getMonth() === selectedMonth &&
                d.getFullYear() === selectedYear
            );
        });

    const categoryTotals = {};

    filtered.forEach((tsx) => {
        const category = tsx.category_id?.name || "Other";
        const amount = Math.abs(parseFloat(tsx.amount));
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += amount;
    });

    const data = [["Category", "Total"]];
    Object.entries(categoryTotals).forEach(([category, total]) => {
        if (total > 0) {
            data.push([category, total]);
        }
    });
    return data;
}

const CategoriesMonthsChart = ({ transactions }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate the list of months for the dropdown 
    const monthsList = []
    for (let i = currentMonth - 1; i >= 0; i--) {
		const date = new Date(currentYear, i, 1);
		const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		const label = date.toLocaleString("default", { month: "long", year: "numeric" });
		monthsList.push({ value, label });
	}

    // Start with the previous month
    const previousMonth = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    const [selectedMonth, setSelectedMonth] = useState(previousMonth);

    // Parse the selected month to get the date
    const [year, month] = selectedMonth.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, 1);

    // Calculate the category totals for the selected month
    const data = calculateCategoryTotalsAllAccountsMonths(transactions, selectedDate);

    // Get the colors for each category
    const displayedCategories = data.slice(1).map(row => row[0]);
    const categoryColors = displayedCategories.map(cat => categoryColorMap[cat] || '#d4e157');

    const options = {
        pieHole: 0.4,
        legend: { position: "bottom" },
        pieSliceText: "label",
        chartArea: { width: "90%", height: "80%" },
        colors: categoryColors
    };

    if (data.length <= 1) {
        return (
            <div className="w-full h-32 flex items-center justify-center">
                <p className="text-gray-500">No data available.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
			<div className="flex items-center justify-between mb-4">
				<select value={selectedMonth}
					onChange={(e) => setSelectedMonth(e.target.value)}
					className="border rounded px-3 py-1 text-sm text-gray-700">
					{monthsList.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
				</select>
            </div>
            <div className="w-full h-96 flex items-center justify-center">
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="100%"
                    data={data}
                    options={options}
                />
            </div>
        </div>
    );
};

export default CategoriesMonthsChart;
