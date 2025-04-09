import { uiModule } from './ui.js';

export const navigationModule = {
    init() {
        this.setupMenuToggle();
        this.setupNavigation();
        this.setupUserActions();  // Add this line
    },

    setupMenuToggle() {
        const menuIcon = document.querySelector('.menu-icon');
        const dropdownMenu = document.querySelector('.dropdown-menu');

        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            menuIcon.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuIcon.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                menuIcon.classList.remove('active');
            }
        });
    },

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Handle navigation
                const targetSection = item.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
                
                // Close menu on mobile
                document.querySelector('.dropdown-menu').classList.remove('show');
                document.querySelector('.menu-icon').classList.remove('active');
            });
        });
    },

    navigateToSection(section) {
        // Hide all content sections
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => section.style.display = 'none');

        // Show selected section
        const targetSection = document.getElementById(`${section}Content`);
        if (targetSection) {
            targetSection.style.display = 'block';
            uiModule.showToast(`Navigated to ${section}`);
        }
    },  // Added comma here

    setupUserActions() {
        const addUserBtn = document.querySelector('.create-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                const modal = document.getElementById('employeeEditModal');
                const modalTitle = modal.querySelector('h2');
                const form = document.getElementById('editEmployeeForm');
                
                form.reset();
                modalTitle.textContent = 'Add New User';
                modal.style.display = 'block';
            });

            // Add close modal functionality
            const modal = document.getElementById('employeeEditModal');
            const closeButtons = modal.querySelectorAll('.close-modal');
            
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            });

            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    },
};