// Admin Dashboard JavaScript

import { alertsModule } from './js/alerts.js';
import { usersModule } from './js/users.js';
import { uiModule } from './js/ui.js';
import { dashboardModule } from './js/dashboard.js';
import { roleAccessModule } from './js/roleAccess.js';

// DOM Elements
const dateRangeSelect = document.getElementById('dateRange');
const allAlertsBtn = document.getElementById('allAlertsBtn');
const pendingAlertsBtn = document.getElementById('pendingAlertsBtn');
const resolvedAlertsBtn = document.getElementById('resolvedAlertsBtn');
const usersBtn = document.getElementById('usersBtn');
const settingsBtn = document.getElementById('settingsBtn');
const logoutBtn = document.getElementById('logoutBtn');
const viewAllBtn = document.querySelector('.view-all-btn');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    dashboardModule.loadDashboardData();
    alertsModule.loadRecentAlerts();
    uiModule.setupEventListeners();
    setupEventListeners();
    roleAccessModule.init(); // Use the module instead of local function
});

// Remove the setupRoleBasedAccess function since it's now in roleAccess.js

// Setup event listeners
function setupEventListeners() {
    dateRangeSelect.addEventListener('change', () => {
        dashboardModule.loadDashboardData();
        alertsModule.loadRecentAlerts();
    });
    
    allAlertsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alertsModule.loadAllAlerts();
    });
    
    pendingAlertsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alertsModule.loadPendingAlerts();
    });
    
    resolvedAlertsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alertsModule.loadResolvedAlerts();
    });
    
    usersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        usersModule.loadUsersList();
    });
    
    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadSettings();
    });
    
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

    viewAllBtn.addEventListener('click', () => {
        alertsModule.loadAllAlerts();
    });
}

// Settings and Logout functions
function loadSettings() {
    uiModule.showSection('settingsContent');
    // Settings implementation will be moved to a separate module later
}

// Simplified logout handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAdmin');
        window.location.href = 'index.html';
    }
}

// Remove the entire addAdminAuthUsers function and its call

// Simplified employee form handler
document.getElementById("editEmployeeForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newEmployee = {
        emp_code: document.getElementById("empCode").value,
        full_name: document.getElementById("fullName").value,
        department: document.getElementById("department").value,
        password: document.getElementById("password").value,
        is_admin: false
    };

    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    employees.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(employees));
    
    alert("Employee created successfully!");
    document.getElementById("employeeEditModal").style.display = "none";
    loadEmployees();
});

// Function to load employees table
// Replace all Supabase user management with local storage example
async function loadEmployees() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = '';
    
    users.forEach((user, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.emp_code}</td>
                <td>${user.full_name}</td>
                <td>${user.department}</td>
                <td>Active</td>
                <td>
                    <button class="action-btn edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}
