// add.js
const API_BASE = "http://subtrack.spiraml.com";
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

// Redirect to login if no token
if (!token) {
    window.location.href = "login.html";
}

// Elements
const freeTrialCheckbox = document.getElementById("free-trial");
const trialDateDiv = document.getElementById("trial-date");
const trialEndInput = document.getElementById("trial-ends");
const amountInput = document.getElementById("password"); // your cost input
const addSubForm = document.getElementById("addSubForm");

// Free trial toggle logic
freeTrialCheckbox.addEventListener("change", () => {
    if (freeTrialCheckbox.checked) {
        trialDateDiv.hidden = false;
        trialEndInput.required = true; // user must select trial end date
    } else {
        trialDateDiv.hidden = true;
        trialEndInput.required = false;
    }
});

// Handle form submission
addSubForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const serviceName = document.getElementById("email").value.trim();
    const cost = parseFloat(amountInput.value);
    const billingCycle = document.getElementById("billing").value.toUpperCase();
    const category = document.getElementById("category").value;
    const startDate = document.getElementById("start-date").value;
    const isTrial = freeTrialCheckbox.checked;
    let trialEndDate = null;

    if (!serviceName || isNaN(cost)) {
        alert("Please enter a valid service name and cost.");
        return;
    }

    // Free trial validation
    if (isTrial) {
        trialEndDate = trialEndInput.value.trim();
        if (!trialEndDate) {
            alert("Please select a trial end date for the free trial.");
            return;
        }
    }

    const newSub = {
        serviceName,
        cost,
        billingCycle,
        category,
        startDate,
        isTrial,
        trialEndDate,
        notes: ""
    };

    try {
        const response = await fetch(`${API_BASE}/api/subscriptions/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(newSub)
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error(errorData);
            alert("Error adding subscription: " + (errorData.error || JSON.stringify(errorData)));
            return;
        }
        alert("Subscription added successfully!");
        window.location.href = "../pages/subscriptions.html";
    } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred. Check console for details.");
    }
});