// analytics.js
const API_BASE = "http://subtrack.spiraml.com";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
// Redirect if not logged in
if (!token) window.location.href = "login.html";


const burnRateEl = document.getElementById("burnRate");
const savingsTextEl = document.getElementById("savingsText");
const topExpensesTable = document.getElementById("topExpensesTable");
const categoryTable = document.getElementById("subByCategoryTable");

fetch(`${API_BASE}/api/analytics/dashboard/${userId}`, {
    headers: { "Authorization": "Bearer " + token }
})
    .then(res => res.json())
    .then(data => {
        console.log("Analytics:", data);

        burnRateEl.textContent = `$${data.monthlyBurnRate.toFixed(2)}`;

        savingsTextEl.textContent =
            `YOU saved $${data.savedFromCancelled.toFixed(2)} by canceling subscriptions`;
    })
    .catch(err => {
        console.error("Analytics error:", err);
    });

fetch(`${API_BASE}/api/subscriptions/${userId}`, {
    headers: { "Authorization": "Bearer " + token }
})
    .then(res => res.json())
    .then(data => {
        console.log("Subscriptions:", data);
        const sorted = [...data]
            .filter(sub => sub.isActive)
            .sort((a, b) => b.cost - a.cost)
            .slice(0, 3);

        topExpensesTable.innerHTML = "";

        if (sorted.length === 0) {
            topExpensesTable.innerHTML =
                "<tr><td colspan='3'>No subscriptions found</td></tr>";
        } else {
            sorted.forEach((sub, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${sub.serviceName}</td>
                <td>$${sub.cost.toFixed(2)}</td>
            `;
                topExpensesTable.appendChild(row);
            });
        }


        const categories = {};

        data.forEach(sub => {
            if (!categories[sub.category]) {
                categories[sub.category] = { count: 0, total: 0 };
            }

            if (sub.isActive) {
                categories[sub.category].count++;
                categories[sub.category].total += sub.cost;
            }
        });

        categoryTable.innerHTML = "";

        const categoryKeys = Object.keys(categories);

        if (categoryKeys.length === 0) {
            categoryTable.innerHTML =
                "<tr><td colspan='3'>No data available</td></tr>";
        } else {
            categoryKeys.forEach(cat => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${cat}</td>
                <td>${categories[cat].count}</td>
                <td>$${categories[cat].total.toFixed(2)}</td>
            `;
                categoryTable.appendChild(row);
            });
        }

    })
    .catch(err => {
        console.error("Subscriptions error:", err);
    });