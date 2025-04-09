import { supabase } from "../../../frontend/supabase-config.js";

// Login function
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const empCode = document.getElementById("empcode").value.trim().toUpperCase();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  message.textContent = ""; // Clear previous errors

  if (!empCode || !password) {
    message.textContent = "Please enter both fields.";
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${empCode.toLowerCase()}@swanson.in`,
      password: password,
    });

    if (error) throw error;

    // ✅ Get user info from 'users' table with safer query
    const { data: employee, error: empError } = await supabase
      .from("users")
      .select("*")
      .ilike("employee_code", empCode)
      .maybeSingle(); // ✅ safe even if 0 rows

    if (empError) throw empError;

    // ✅ Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(employee));

    // ✅ Redirect based on role
    window.location.href = employee.is_admin
      ? "../admin/admin.html"
      : "../dashboard/dashboard.html";
  } catch (error) {
    console.error("Login failed:", error);
    message.textContent = "Login failed. Please check credentials.";
  }
});

// ✅ Logout logic (if logoutBtn exists on the page)
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem("user");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Error logging out. Please try again.");
  }
});

// ✅ Form submission for Quality Alerts (keep for now)
document.getElementById("submitForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData) {
    alert("Please login first!");
    window.location.href = "index.html";
    return;
  }

  const formData = {
    employee_code: userData.employee_code,
    employee_name: userData.full_name,
    department: userData.department,
    incident_title: document.getElementById("incidentTitle").value,
    responsible_dept: document.getElementById("responsibleDept").value,
    location_area: document.getElementById("locationArea").value,
    incident_date: document.getElementById("incidentDate").value,
    incident_time: document.getElementById("incidentTime").value,
    abnormality_type: document.getElementById("abnormalityType").value,
    quality_risk: document.getElementById("qualityRisk").value,
    kept_in_view: document.getElementById("keptInView").value,
    incident_desc: document.getElementById("incidentDesc").value,
    defect_description: document.getElementById("defectDescription").value,
    product_code: document.getElementById("productCode")?.value || "",
    roll_id: document.getElementById("rollID")?.value || "",
    lot_no: document.getElementById("lotNo")?.value || "",
    roll_positions: document.getElementById("rollPositions")?.value || "",
    lot_time: document.getElementById("lotTime")?.value || "",
    action_taken: document.getElementById("actionTaken").value,
    who_action: document.getElementById("whoAction").value,
    when_action_date: document.getElementById("whenActionDate").value,
    status_action: document.getElementById("statusAction").value,
    created_at: new Date().toISOString(),
    status: "Pending",
  };

  try {
    const alerts = JSON.parse(localStorage.getItem("quality_alerts") || "[]");
    alerts.push(formData);
    localStorage.setItem("quality_alerts", JSON.stringify(alerts));
    alert("Quality Alert submitted successfully!");
    document.getElementById("submitForm").reset();
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form. Please try again.");
  }
});
