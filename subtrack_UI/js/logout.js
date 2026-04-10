document.addEventListener("click", function(e) {
    const logoutLink = e.target.closest("#logout");
    if (logoutLink) {
        e.preventDefault();

        localStorage.clear();
        window.location.href = "index.html";
    }
});