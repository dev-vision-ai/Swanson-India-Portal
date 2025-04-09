// Role-based access control module
export const roleAccessModule = {
    init() {
        const user = JSON.parse(localStorage.getItem("user"));
        const hrSection = document.getElementById("hr-tools");
        const qaSection = document.getElementById("qa-tools");
        const usersBtn = document.getElementById("usersBtn");
        const allAlertsBtn = document.getElementById("allAlertsBtn");
        const pendingAlertsBtn = document.getElementById("pendingAlertsBtn");
        const resolvedAlertsBtn = document.getElementById("resolvedAlertsBtn");

        if (!user) {
            window.location.href = "../LoginSignup/index.html"; // Force login
        } else if (user.employee_code === "ADMIN_HR") {
            hrSection.style.display = "block";
            // Show users management section for HR admins
            usersBtn.style.display = "block";
            // Hide alerts sections for HR admins
            allAlertsBtn.style.display = "none";
            pendingAlertsBtn.style.display = "none";
            resolvedAlertsBtn.style.display = "none";
        } else if (user.employee_code === "ADMIN_QA") {
            qaSection.style.display = "block";
            // Hide users management for QA admins
            usersBtn.style.display = "none";
            // Show alerts sections for QA admins
            allAlertsBtn.style.display = "block";
            pendingAlertsBtn.style.display = "block";
            resolvedAlertsBtn.style.display = "block";
        }
    }
};