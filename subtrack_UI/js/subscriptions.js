const API_BASE = "http://subtrack.spiraml.com";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const subSummary = document.querySelector(".subscriptions-summary");

if (!token) {
    window.location.href = "login.html";
}

const table = document.getElementById("subListTable");

const searchInput = document.getElementById("subscriptions-search");
const categoryBox = document.getElementById("category-box");
const sortBox = document.getElementById("filter-box");

let subscriptionStorage = [];

function statusClass(status) {
    switch (status) {
        case "RED": return "red-light";
        case "YELLOW": return "yellow-light";
        case "GREEN": return "green-light";
        case "BLUE": return "blue-light";
        default: return "";
    }
}

// Filtering function
function filterSubscriptions() {
    let filtered = [...subscriptionStorage];
    // SEARCH BOX
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        filtered = filtered.filter(sub =>
            sub.serviceName.toLowerCase().includes(query)
        );
    }
    // CATEGORY BOX
    const selectedCategory = categoryBox.value;
    if (selectedCategory !== "All Categories") {
        filtered = filtered.filter(sub =>
            sub.category === selectedCategory
        );
    }
    // SORT BOX
    const selectedSort = sortBox.value;
    if (selectedSort === "Cost (High to Low)") {
        filtered.sort((a, b) => b.cost - a.cost);
    }
    else if (selectedSort === "Cost (Low to High)") {
        filtered.sort((a, b) => a.cost - b.cost);
    }
    else if (selectedSort === "Name (A-Z)") {
        filtered.sort((a, b) =>
            a.serviceName.localeCompare(b.serviceName)
        );
    }
    else {
        filtered.sort((a, b) =>
            new Date(a.nextBillingDate) - new Date(b.nextBillingDate)
        );
    }

    // GENERATE TABLE
    table.innerHTML = "";
    let total = 0;
    filtered.forEach(sub => {
        total += sub.cost;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sub.serviceName}</td>
            <td>${sub.category}</td>
            <td>$${sub.cost.toFixed(2)}</td>
            <td>${sub.billingCycle}</td>
            <td class="${statusClass(sub.status)}">${sub.status}</td>
            <td><button onclick="location.href='edit-subscription.html?id=${sub.id}'">Edit</button></td>
        `;
        table.appendChild(row);
    });
    subSummary.textContent =
        `Showing ${filtered.length} subscriptions ● Total: $${total.toFixed(2)}`;
}

fetch(API_BASE + "/api/subscriptions/" + userId, {
    headers: { "Authorization": "Bearer " + token }
})
    .then(response => response.json())
    .then(data => {
        subscriptionStorage = data;
        filterSubscriptions();
    });

searchInput.addEventListener("input", filterSubscriptions);
categoryBox.addEventListener("change", filterSubscriptions);
sortBox.addEventListener("change", filterSubscriptions);