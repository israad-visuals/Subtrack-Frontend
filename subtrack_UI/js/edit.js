// edit.js

const API_BASE = "http://subtrack.spiraml.com";
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

// Redirect if not logged in
if (!token) window.location.href = "login.html";

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const subscriptionId = params.get("id");

if (!subscriptionId) {
    alert("No subscription selected.");
    window.location.href = "subscriptions.html";
}

// Elements
const trialCheckbox = document.getElementById("free-trial");
const trialEndsDiv = document.getElementById("trial-date");
const trialEndInput = document.getElementById("trial-ends");

// Toggle trial UI
trialCheckbox.onchange = () => {
    trialEndsDiv.hidden = !trialCheckbox.checked;
    trialEndInput.required = trialCheckbox.checked;
};


fetch(API_BASE + "/api/subscriptions/" + userId, {
    headers: { "Authorization": "Bearer " + token }
})
    .then(res => res.json())
    .then(data => {
        const sub = data.find(s => s.id == subscriptionId);
        if (!sub) {
            alert("Subscription not found.");
            return;
        }
        document.getElementById("email").value = sub.serviceName;
        document.getElementById("password").value = sub.cost;
        document.getElementById("billing").value =
            sub.billingCycle.charAt(0) + sub.billingCycle.slice(1).toLowerCase();
        document.getElementById("category").value = sub.category;
        document.getElementById("start-date").value = sub.startDate;
        if (sub.isTrial) {
            trialCheckbox.checked = true;
            trialEndsDiv.hidden = false;
            trialEndInput.required = true;
            trialEndInput.value = sub.trialEndDate;
        }
    });


document.getElementById("editSubForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const serviceName = document.getElementById("email").value.trim();
    const cost = parseFloat(document.getElementById("password").value);
    const billingCycle = document.getElementById("billing").value.toUpperCase();
    const category = document.getElementById("category").value;
    const startDate = document.getElementById("start-date").value;
    const isTrial = trialCheckbox.checked;
    const trialEndDate = isTrial ? trialEndInput.value : null;
    if (!serviceName || isNaN(cost) || cost <= 0) {
        alert("Please enter valid service name and cost.");
        return;
    }
    if (isTrial && !trialEndDate) {
        alert("Please select a trial end date.");
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/api/subscriptions/${subscriptionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                serviceName,
                cost,
                billingCycle,
                category,
                startDate,
                isTrial,
                trialEndDate,
                notes: ""
            })
        });
        if (!response.ok) {
            const err = await response.json();
            console.error(err);
            alert("Error updating subscription");
            return;
        }
        alert("Subscription updated!");
        window.location.href = "subscriptions.html";
    } catch (err) {
        console.error(err);
        alert("Something went wrong.");
    }
});

document.getElementById("cancelSub").addEventListener("click", async () => {
    try {
        const response = await fetch(
            `${API_BASE}/api/subscriptions/${subscriptionId}/cancel`,
            {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );
        if (!response.ok) {
            alert("Failed to cancel subscription");
            return;
        }
        alert("Subscription cancelled");
        window.location.href = "subscriptions.html";
    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
});