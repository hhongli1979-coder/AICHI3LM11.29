document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const header = document.getElementById("header");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarToggleHeader = document.getElementById("sidebarToggleHeader");

    // Set initial state from localStorage
    if (localStorage.getItem("sidebarOpen") === "true") {
        sidebar.classList.add("open");
        header.classList.add("open");
    } else {
        sidebar.classList.remove("open");
        header.classList.remove("open");
    }

    // Function to toggle sidebar and save state
    function toggleSidebar() {
        sidebar.classList.toggle("open");
        header.classList.toggle("open");

        // Save state in localStorage
        localStorage.setItem("sidebarOpen", sidebar.classList.contains("open") ? "true" : "false");
    }

    // Attach event listeners to both toggles
    sidebarToggle?.addEventListener("click", toggleSidebar);
    sidebarToggleHeader?.addEventListener("click", toggleSidebar);
});
