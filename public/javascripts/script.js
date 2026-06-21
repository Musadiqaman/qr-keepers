

(function () {
    const root = document.documentElement;
    const saved = localStorage.getItem("qrkeepers-theme");

    if (saved === "dark") {
        root.classList.add("dark");
    }

    function applyIcon() {
        const btn = document.getElementById("darkModeToggle");
        if (btn) btn.textContent = root.classList.contains("dark") ? "☀️" : "🌙";

        const switchEl = document.getElementById("darkModeSwitch");
        if (switchEl) switchEl.checked = root.classList.contains("dark");
    }

    function toggleTheme() {
        root.classList.toggle("dark");
        localStorage.setItem("qrkeepers-theme", root.classList.contains("dark") ? "dark" : "light");
        applyIcon();
    }

    document.addEventListener("DOMContentLoaded", () => {
        applyIcon();

        const navBtn = document.getElementById("darkModeToggle");
        if (navBtn) navBtn.addEventListener("click", toggleTheme);

        const switchEl = document.getElementById("darkModeSwitch");
        if (switchEl) switchEl.addEventListener("change", toggleTheme);

        // mobile nav toggle
        const navToggle = document.getElementById("navToggle");
        const navLinks = document.getElementById("navLinks");
        if (navToggle && navLinks) {
            navToggle.addEventListener("click", () => {
                navLinks.classList.toggle("open");
            });
        }
    });
})();


