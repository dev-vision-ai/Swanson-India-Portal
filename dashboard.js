import { dbModule } from '../database.js';
import { uiModule } from '../ui.js';

export const dashboardModule = {
    // Statistics Calculation
    async calculateStats(startDate = null) {
        try {
            const alerts = await dbModule.queryDocuments('qualityAlerts', startDate ? [['timestamp', '>=', startDate]] : []);
            
            return {
                totalAlerts: alerts.length,
                pendingAlerts: alerts.filter(a => a.status === 'Pending').length,
                resolvedAlerts: alerts.filter(a => a.status === 'Resolved').length,
                averageResolutionTime: this.calculateAverageResolutionTime(alerts)
            };
        } catch (error) {
            console.error('Error calculating stats:', error);
            throw error;
        }
    },

    calculateAverageResolutionTime(alerts) {
        const resolvedAlerts = alerts.filter(a => a.status === 'Resolved' && a.resolvedAt);
        if (!resolvedAlerts.length) return 0;

        const totalTime = resolvedAlerts.reduce((sum, alert) => {
            const created = new Date(alert.timestamp);
            const resolved = new Date(alert.resolvedAt);
            return sum + (resolved - created);
        }, 0);

        return Math.round(totalTime / resolvedAlerts.length / (1000 * 60 * 60)); // Hours
    },

    // Dashboard Data Loading
    async loadDashboardData() {
        try {
            uiModule.showLoading('dashboardStats');
            
            const dateRange = document.getElementById('dateRange').value;
            const startDate = this.getStartDateFromRange(dateRange);
            
            const stats = await this.calculateStats(startDate);
            this.updateStatCards(stats);
            await this.updateCharts(startDate);
            
            uiModule.hideLoading('dashboardStats');
        } catch (error) {
            console.error('Error loading dashboard:', error);
            uiModule.showToast('Failed to load dashboard data', 'error');
        }
    },

    // Date Range Filtering
    getStartDateFromRange(range) {
        const date = new Date();
        switch(range) {
            case '7d': return new Date(date.setDate(date.getDate() - 7));
            case '30d': return new Date(date.setDate(date.getDate() - 30));
            case '90d': return new Date(date.setDate(date.getDate() - 90));
            case '1y': return new Date(date.setFullYear(date.getFullYear() - 1));
            default: return null;
        }
    },

    // Chart Generation
    async updateCharts(startDate) {
        await Promise.all([
            this.updateAlertTrendChart(startDate),
            this.updateDepartmentChart(startDate),
            this.updateStatusChart(startDate)
        ]);
    },

    async updateAlertTrendChart(startDate) {
        const alerts = await dbModule.queryDocuments('qualityAlerts', startDate ? [['timestamp', '>=', startDate]] : []);
        const data = this.groupAlertsByDate(alerts);
        
        const chart = new Chart('alertTrendChart', {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Alerts',
                    data: Object.values(data),
                    borderColor: '#4CAF50'
                }]
            }
        });
    },

    async updateDepartmentChart(startDate) {
        const alerts = await dbModule.queryDocuments('qualityAlerts', startDate ? [['timestamp', '>=', startDate]] : []);
        const data = this.groupAlertsByDepartment(alerts);
        
        const chart = new Chart('departmentChart', {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Alerts by Department',
                    data: Object.values(data),
                    backgroundColor: '#2196F3'
                }]
            }
        });
    },

    async updateStatusChart(startDate) {
        const alerts = await dbModule.queryDocuments('qualityAlerts', startDate ? [['timestamp', '>=', startDate]] : []);
        const data = this.groupAlertsByStatus(alerts);
        
        const chart = new Chart('statusChart', {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: ['#F44336', '#4CAF50', '#FFC107']
                }]
            }
        });
    },

    // Data Grouping Helpers
    groupAlertsByDate(alerts) {
        return alerts.reduce((acc, alert) => {
            const date = new Date(alert.timestamp).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    },

    groupAlertsByDepartment(alerts) {
        return alerts.reduce((acc, alert) => {
            const dept = alert.responsibleDept || 'Unknown';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});
    },

    groupAlertsByStatus(alerts) {
        return alerts.reduce((acc, alert) => {
            const status = alert.status || 'Pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    },

    // Summary Card Updates
    updateStatCards(stats) {
        const elements = {
            totalAlerts: document.getElementById('totalAlerts'),
            pendingAlerts: document.getElementById('pendingAlerts'),
            resolvedAlerts: document.getElementById('resolvedAlerts'),
            averageTime: document.getElementById('averageResolutionTime')
        };

        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                element.textContent = stats[key] || '0';
            }
        }
    }
};