import { dbModule } from './database.js';
import { uiModule } from './ui.js';

export const usersModule = {
    // User Management Operations
    async createUser(userData) {
        try {
            const docRef = await dbModule.addDocument('users', userData);
            uiModule.showToast('User created successfully');
            return docRef.id;
        } catch (error) {
            console.error('Error creating user:', error);
            uiModule.showToast('Failed to create user', 'error');
            throw error;
        }
    },

    async getUser(id) {
        return await dbModule.getDocument('users', id);
    },

    async updateUser(id, userData) {
        try {
            await dbModule.updateDocument('users', id, userData);
            uiModule.showToast('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            uiModule.showToast('Failed to update user', 'error');
            throw error;
        }
    },

    async deleteUser(id) {
        try {
            await dbModule.deleteDocument('users', id);
            uiModule.showToast('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            uiModule.showToast('Failed to delete user', 'error');
            throw error;
        }
    },

    // Role Management
    async updateUserRole(id, newRole) {
        try {
            await this.updateUser(id, { role: newRole });
            return true;
        } catch (error) {
            console.error('Error updating role:', error);
            return false;
        }
    },

    // Department Assignment
    async assignDepartment(userId, departmentId) {
        try {
            await this.updateUser(userId, { departmentId });
            uiModule.showToast('Department assigned successfully');
        } catch (error) {
            console.error('Error assigning department:', error);
            uiModule.showToast('Failed to assign department', 'error');
        }
    },

    // User List Management
    async loadUsersList() {
        try {
            const users = await dbModule.getAllDocuments('users');
            return this.generateUserTable(users);
        } catch (error) {
            console.error('Error loading users:', error);
            throw error;
        }
    },

    // Table Generation
    generateUserTable(users) {
        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';

        if (!users.length) {
            tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
            return;
        }

        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.department || 'N/A'}</td>
                <td>${user.role || 'User'}</td>
                <td>
                    <button onclick="editUser('${user.id}')" class="btn btn-edit">Edit</button>
                    <button onclick="deleteUser('${user.id}')" class="btn btn-delete">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },

    // User Profile Management
    async updateUserProfile(id, profileData) {
        try {
            await this.updateUser(id, profileData);
            uiModule.showToast('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            uiModule.showToast('Failed to update profile', 'error');
        }
    },

    // Authentication Status
    checkAuthStatus() {
        const user = dbModule.getCurrentUser();
        return {
            isAuthenticated: !!user,
            user: user
        };
    },

    // Search Users
    async searchUsers(query) {
        try {
            const users = await dbModule.searchDocuments('users', query);
            return this.generateUserTable(users);
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }
};