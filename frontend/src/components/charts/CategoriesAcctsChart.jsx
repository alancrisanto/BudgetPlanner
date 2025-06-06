import { Chart } from "react-google-charts";

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

function calculateCategoryTotalsAllAccounts(transactions) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Filter transactions for the current month and year
    const filtered = transactions
        .filter((tsx) => {
            const d = new Date(tsx.date);
            return (
                tsx.type === "expense" &&
                d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear
            );
        });

    const categoryTotals = {};

    // Calculate totals for each category
    filtered.forEach((tsx) => {
        const category = tsx.category_id?.name || "Other";
        const amount = Math.abs(parseFloat(tsx.amount));
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += amount;
    });

    // Prepare data for the chart
    const data = [["Category", "Total"]];
    Object.entries(categoryTotals).forEach(([category, total]) => {
        if (total > 0) {
            data.push([category, total]);
        }
    });

    return data;
}

const CategoriesAcctsChart = ({ transactions, selectedDate }) => {
    const data = calculateCategoryTotalsAllAccounts(transactions, selectedDate);

    // Get the colors for each category
    const displayedCategories = data.slice(1).map(row => row[0]);
    const categoryColors = displayedCategories.map(cat => categoryColorMap[cat] || '#d4e157');

    const options = {
        pieHole: 0.4,
        legend: { position: "bottom" },
        pieSliceText: "label",
        chartArea: { width: "90%", height: "80%" },
        colors: categoryColors,
    };

    if (data.length <= 1) {
        return (
            <div className="w-full h-32 flex items-center justify-center">
                <p className="text-gray-500">No data available.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-96 flex items-center justify-center">
            <Chart
                chartType="PieChart"
                width="100%"
                height="100%"
                data={data}
                options={options}
            />
        </div>
    );
};

export default CategoriesAcctsChart;
