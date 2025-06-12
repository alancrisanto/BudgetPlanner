import React from "react";

function getTopCategoriesPerMonth(transactions, monthCount = 5) {
    const now = new Date();
    const results = [];

    for (let i = 0; i < monthCount; i++) {
        const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(target.getFullYear(), target.getMonth(), 1);
        const end = new Date(target.getFullYear(), target.getMonth() + 1, 0, 23, 59, 59, 999);

        const filtered = transactions.filter((t) => {
            const d = new Date(t.date);
            return (
                t.type === "expense" &&
                d >= start && d <= end
            );
        });

        const categoryMap = {};
        filtered.forEach((t) => {
            const cat = t.category_id?.name || "Other";
            if (!categoryMap[cat]) categoryMap[cat] = { total: 0, count: 0 };
            categoryMap[cat].total += Math.abs(t.amount);
            categoryMap[cat].count += 1;
        });

        const topCategory = Object.entries(categoryMap)
            .sort((a, b) => b[1].total - a[1].total)[0];

        results.push({
            month: start.toLocaleString("default", { month: "long", year: "numeric" }),
            category: topCategory?.[0] || "No data",
            total: topCategory?.[1]?.total || 0,
            count: topCategory?.[1]?.count || 0,
        });
    }

    return results;
}

const CategoriesMonthsChart = ({ transactions }) => {
    const monthlyTopCategories = getTopCategoriesPerMonth(transactions, 5);

    return (
        <div>
            <ul className="space-y-4">
                {monthlyTopCategories.map(({ month, category, total, count }) => (
                    <li key={month} className="flex justify-between items-start p-2 rounded-md hover:bg-gray-100 transition duration-150">
                        <div>
                            <span className="font-medium text-gray-800">{category}</span>
                            <div className="text-sm text-gray-500">{count} transaction{count !== 1 ? "s" : ""}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-base font-semibold text-gray-800">${total.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{month}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoriesMonthsChart;
