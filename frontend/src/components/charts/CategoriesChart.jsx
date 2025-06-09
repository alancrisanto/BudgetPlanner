import { Chart } from "react-google-charts";

const categoryColorMap = {
    Groceries: '#42a5f5',
    Rent: '#26c6da',
    Utilities: '#ab47bc',
    Takeout: '#66bb6a',
    Transportation: '#ffa726',
    Entertainment: '#ef5350',
    Health: '#d4e157',
    Shopping: '#8d6e63',
    Other: '#fdd835',
};

function calculateCategoryTotals(transactions) {
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

    transactions.forEach((tsx) => {
        const category = tsx.category_id?.name;
        if (category && category in categoryTotals) {
            categoryTotals[category] += tsx.amount;
        }
    });

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

    const displayedCategories = data.slice(1).map(row => row[0]);
    const categoryColors = displayedCategories.map(cat => categoryColorMap[cat] || '#d4e157');

    const options = {
        pieHole: 0.4,
        legend: { position: "bottom" },
        pieSliceText: "label",
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

export default CategoriesChart;
