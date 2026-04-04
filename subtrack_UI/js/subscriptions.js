const API_BASE = "http://subtrack.spiraml.com";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const subSummary = document.querySelector(".subscriptions-summary");
// If no token, user is not logged in. Send them to login page.
if (!token) { window.location.href = "login.html"; }
const table = document.getElementById("subListTable");

function statusClass(status) {
    switch (status) {
        case "RED": return "red-light";
        case "YELLOW": return "yellow-light";
        case "GREEN": return "green-light";
        case "BLUE": return "blue-light";
        default: return "";
    }
}



fetch(API_BASE + "/api/subscriptions/" + userId, {
    headers: { "Authorization": "Bearer " + token }
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        table.innerHTML = "";
        let total = 0;


        data.forEach(sub => {
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
        subSummary.textContent = `Showing ${data.length} subscriptions ● Total: $${total}`;

    });


const activityToggle = document.getElementById("active")
const activityLabel = document.getElementById("activeLabel")
activityToggle.onchange=()=> {
    if(activityToggle.checked){
        activityLabel.textContent = "discontinued";
    }else{
        activityLabel.textContent = "active";
    }

}