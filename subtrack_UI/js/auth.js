// Login
const API_BASE = "http://subtrack.spiraml.com";
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
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
        })
    }
})


// registration
document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const confirmPassword = document.getElementById("confirm-password").value;
            const error = document.querySelector(".error-message");

            const firstName = document.getElementById("first-name").value;
            const lastName = document.getElementById("last-name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            // password match check
            if(password!==confirmPassword){
                e.preventDefault();
                error.style.display = "block";
                return;
            }
            fetch(API_BASE + "/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName })
            })
                .then(response => {
                    if (!response.ok) { alert("Registration failed"); return; }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("userId", data.userId);
                        localStorage.setItem("userName", data.firstName);
                        window.location.href = "login.html";
                    }
                });
        })
    }
})


