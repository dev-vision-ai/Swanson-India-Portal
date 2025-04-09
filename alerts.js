import { dbModule } from '../database.js';
import { uiModule } from '../ui.js';

export const alertsModule = {
    // CRUD Operations
    async createAlert(alertData) {
        try {
            const docRef = await dbModule.addDocument('qualityAlerts', alertData);
            uiModule.showToast('Alert created successfully');
            return docRef.id;
        } catch (error) {
            console.error('Error creating alert:', error);
            uiModule.showToast('Failed to create alert', 'error');
            throw error;
        }
    },

    async getAlert(id) {
        return await dbModule.getDocument('qualityAlerts', id);
    },

    async updateAlert(id, alertData) {
        try {
            await dbModule.updateDocument('qualityAlerts', id, alertData);
            uiModule.showToast('Alert updated successfully');
        } catch (error) {
            console.error('Error updating alert:', error);
            uiModule.showToast('Failed to update alert', 'error');
            throw error;
        }
    },

    async deleteAlert(id) {
        try {
            await dbModule.deleteDocument('qualityAlerts', id);
            uiModule.showToast('Alert deleted successfully');
        } catch (error) {
            console.error('Error deleting alert:', error);
            uiModule.showToast('Failed to delete alert', 'error');
            throw error;
        }
    },

    // Status Management
    async updateAlertStatus(id, newStatus) {
        try {
            await this.updateAlert(id, {
                status: newStatus,
                lastUpdated: new Date()
            });
            return true;
        } catch (error) {
            console.error('Error updating status:', error);
            return false;
        }
    },

    // Alert Filtering
    async loadPendingAlerts() {
        try {
            const alerts = await dbModule.queryDocuments('qualityAlerts', [
                ['status', '==', 'Pending'],
                ['orderBy', 'timestamp', 'desc']
            ]);
            return this.generateAlertTable(alerts, 'Pending Alerts');
        } catch (error) {
            console.error('Error loading pending alerts:', error);
            throw error;
        }
    },

    async loadResolvedAlerts() {
        try {
            const alerts = await dbModule.queryDocuments('qualityAlerts', [
                ['status', '==', 'Resolved'],
                ['orderBy', 'timestamp', 'desc']
            ]);
            return this.generateAlertTable(alerts, 'Resolved Alerts');
        } catch (error) {
            console.error('Error loading resolved alerts:', error);
            throw error;
        }
    },

    // Table Generation
    async generateAlertTable(alerts, title = 'Alerts') {
        const tableBody = document.getElementById('alertsTableBody');
        tableBody.innerHTML = '';

        if (!alerts.length) {
            tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No alerts found</td></tr>';
            return;
        }

        alerts.forEach((alert, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${alert.incidentTitle || 'Untitled'}</td>
                <td>${alert.responsibleDept || 'N/A'}</td>
                <td>${new Date(alert.timestamp).toLocaleString()}</td>
                <td><span class="status-badge ${alert.status?.toLowerCase()}">${alert.status}</span></td>
                <td>
                    <button onclick="viewAlertDetails('${alert.id}')" class="btn btn-view">View</button>
                    <button onclick="editAlert('${alert.id}')" class="btn btn-edit">Edit</button>
                    <button onclick="deleteAlert('${alert.id}')" class="btn btn-delete">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },

    // Alert Detail View
    async viewAlertDetails(id) {
        try {
            const alert = await this.getAlert(id);
            if (!alert) {
                throw new Error('Alert not found');
            }

            const modalContent = `
                <h2>${alert.incidentTitle || 'Untitled Alert'}</h2>
                <div class="alert-details">
                    <p><strong>Department:</strong> ${alert.responsibleDept || 'N/A'}</p>
                    <p><strong>Status:</strong> ${alert.status}</p>
                    <p><strong>Description:</strong> ${alert.description || 'No description'}</p>
                    <p><strong>Created:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <div class="modal-actions">
                    <button onclick="editAlert('${id}')" class="btn btn-edit">Edit</button>
                    <button onclick="deleteAlert('${id}')" class="btn btn-delete">Delete</button>
                </div>
            `;

            uiModule.showModal('alertDetailsModal', modalContent);
        } catch (error) {
            console.error('Error viewing alert details:', error);
            uiModule.showToast('Failed to load alert details', 'error');
        }
    },

    // Search Functionality
    async searchAlerts(query) {
        try {
            const alerts = await dbModule.searchDocuments('qualityAlerts', query);
            return this.generateAlertTable(alerts, 'Search Results');
        } catch (error) {
            console.error('Error searching alerts:', error);
            throw error;
        }
    }
};