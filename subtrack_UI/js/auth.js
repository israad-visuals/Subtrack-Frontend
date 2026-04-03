// Login
const API_BASE = "http://subtrack.spiraml.com";
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(response => {
            if (!response.ok) { alert("Invalid email or password"); return; }
            return response.json();
        })
        .then(data => {
            if (data) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("userName", data.firstName);
                window.location.href = "dashboard.html";
            }
        });
});
