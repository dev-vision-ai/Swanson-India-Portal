export const uiModule = {
    // Modal Management
    showModal(modalId, content = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (content) {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.innerHTML = content;
            }
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    },

    // Section Visibility
    showSection(sectionId) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
        this.updateActiveMenuItem(sectionId);
    },

    // Menu Toggle
    toggleMenu() {
        const menu = document.querySelector('.sidebar');
        menu.classList.toggle('collapsed');
    },

    // Event Listeners Setup
    setupEventListeners() {
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });

        // Menu toggle button
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Outside modal click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    },

    // Loading States
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        element.appendChild(loadingSpinner);
    },

    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const spinner = element.querySelector('.loading-spinner');
        if (spinner) spinner.remove();
    },

    // Toast Notifications
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Active Menu Item
    updateActiveMenuItem(sectionId) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    },

    // Form Validation
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return true;

        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    },

    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.classList.add('error');
        field.parentNode.appendChild(errorDiv);
    },

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    }
};