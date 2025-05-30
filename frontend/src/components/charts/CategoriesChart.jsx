import { Chart } from "react-google-charts";

function calculateCategoryTotals(transactions) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month and year
    const filtered = transactions
        .filter((tsx) => {
            const d = new Date(tsx.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Initialize category totals
    const categoryTotals = {
        Groceries: 0,
        Rent: 0,
        Utilities: 0,
        Takeout: 0,
        Transportation: 0,
        Entertainment: 0,
        Health: 0,
        Shopping: 0,
        Other: 0,
    };

    // Calculate totals for each category
    filtered.forEach((tsx) => {
        const category = tsx.category_id?.name;
        if (category && category in categoryTotals) {
            categoryTotals[category] += tsx.amount;
        }
    });

    // Prepare data for Google Charts
    const data = [["Category", "Total"]];
    Object.entries(categoryTotals).forEach(([category, total]) => {
        if (total > 0) {
            data.push([category, total]);
        }
    });

    return data;
}

const CategoriesChart = ({ transactions }) => {
    const data = calculateCategoryTotals(transactions);

    const options = {
        pieHole: 0,
        legend: { position: "bottom" },
        pieSliceText: "label",
    };

    // Ensure the data has at least one row for the chart to render
    if (data.length <= 1) {
        return (
            <div className={"w-full h-32 flex items-center justify-center"}>
                <p className="text-gray-500">No data available.</p>
            </div>
        );
    }

    return (
        <div className={"w-full h-96 flex items-center justify-center"}>
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

export default CategoriesChart;