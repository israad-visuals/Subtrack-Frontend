// stat cards
const API_BASE = "http://subtrack.spiraml.com";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
// If no token, user is not logged in. Send them to login page.
if (!token) { window.location.href = "login.html"; }
// Get dashboard data
fetch(API_BASE + "/api/analytics/dashboard/" + userId, {
    headers: { "Authorization": "Bearer " + token }
})
.then(response => response.json())
    .then(data => {
        document.getElementById("burnRate").textContent = "$" +
            data.monthlyBurnRate;
        document.getElementById("activeCount").textContent =
            data.activeSubscriptionCount;
        document.getElementById("trialCount").textContent = data.freeTrialCount +
" free trials";
        document.getElementById("dueThisWeek").textContent =
            data.paymentsDueThisWeek;
        document.getElementById("savedAmount").textContent = "$" +
            data.savedFromCancelled;
    });

// upcoming sub table
const table = document.getElementById("subscriptionsTable");

fetch(API_BASE + "/api/subscriptions/" + userId, {
    headers: { "Authorization": "Bearer " + token }
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        table.innerHTML = "";

        data.forEach(sub => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${sub.serviceName}</td>
            <td>$${sub.cost}</td>
            <td>${sub.billingCycle}</td>
            <td>${sub.category}</td>
            <td>${sub.status}</td>
        `;
            table.appendChild(row);
        });
    });

// status will become billing date