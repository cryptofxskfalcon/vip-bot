// VIP Bot Dashboard JavaScript

class VIPBotDashboard {
    constructor() {
        this.botStatus = 'offline';
        this.subscriptions = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSubscriptions();
        this.updateUI();
    }

    bindEvents() {
        const startBtn = document.getElementById('start-bot');
        const stopBtn = document.getElementById('stop-bot');
        const refreshBtn = document.getElementById('refresh-data');

        startBtn.addEventListener('click', () => this.startBot());
        stopBtn.addEventListener('click', () => this.stopBot());
        refreshBtn.addEventListener('click', () => this.refreshData());
    }

    async loadSubscriptions() {
        try {
            // In a real implementation, this would fetch from your Python backend
            // For now, we'll simulate loading subscriptions
            await this.simulateLoading();
            
            // Mock subscription data
            this.subscriptions = [
                { id: 1, user: 'User123', type: 'Premium', expires: '2024-12-31' },
                { id: 2, user: 'User456', type: 'VIP', expires: '2024-11-15' },
                { id: 3, user: 'User789', type: 'Premium', expires: '2024-10-20' }
            ];
            
            this.renderSubscriptions();
        } catch (error) {
            console.error('Failed to load subscriptions:', error);
            this.showError('Failed to load subscription data');
        }
    }

    renderSubscriptions() {
        const container = document.getElementById('subscriptions-list');
        
        if (this.subscriptions.length === 0) {
            container.innerHTML = '<p>No active subscriptions found</p>';
            return;
        }

        const subscriptionHTML = this.subscriptions.map(sub => `
            <div class="subscription-item" style="
                padding: 1rem;
                margin: 0.5rem 0;
                background: #f7fafc;
                border-radius: 8px;
                border-left: 4px solid #4299e1;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${sub.user}</strong>
                        <span style="margin-left: 1rem; color: #718096;">${sub.type}</span>
                    </div>
                    <div style="color: #718096; font-size: 0.9rem;">
                        Expires: ${sub.expires}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = subscriptionHTML;
    }

    async startBot() {
        try {
            const startBtn = document.getElementById('start-bot');
            const stopBtn = document.getElementById('stop-bot');
            
            startBtn.disabled = true;
            startBtn.textContent = 'Starting...';
            
            // Simulate bot startup
            await this.simulateLoading(2000);
            
            this.botStatus = 'online';
            this.updateStatusIndicator();
            
            startBtn.disabled = true;
            startBtn.textContent = 'Start Bot';
            stopBtn.disabled = false;
            
            this.showSuccess('Bot started successfully!');
        } catch (error) {
            console.error('Failed to start bot:', error);
            this.showError('Failed to start bot');
            document.getElementById('start-bot').disabled = false;
        }
    }

    async stopBot() {
        try {
            const startBtn = document.getElementById('start-bot');
            const stopBtn = document.getElementById('stop-bot');
            
            stopBtn.disabled = true;
            stopBtn.textContent = 'Stopping...';
            
            // Simulate bot shutdown
            await this.simulateLoading(1000);
            
            this.botStatus = 'offline';
            this.updateStatusIndicator();
            
            startBtn.disabled = false;
            stopBtn.disabled = true;
            stopBtn.textContent = 'Stop Bot';
            
            this.showSuccess('Bot stopped successfully!');
        } catch (error) {
            console.error('Failed to stop bot:', error);
            this.showError('Failed to stop bot');
            document.getElementById('stop-bot').disabled = false;
        }
    }

    async refreshData() {
        const refreshBtn = document.getElementById('refresh-data');
        const originalText = refreshBtn.textContent;
        
        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Refreshing...';
        
        try {
            await this.loadSubscriptions();
            this.showSuccess('Data refreshed successfully!');
        } catch (error) {
            this.showError('Failed to refresh data');
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.textContent = originalText;
        }
    }

    updateStatusIndicator() {
        const statusDot = document.querySelector('.status-dot');
        const statusText = statusDot.nextElementSibling;
        
        statusDot.className = `status-dot ${this.botStatus}`;
        statusText.textContent = this.botStatus.charAt(0).toUpperCase() + this.botStatus.slice(1);
    }

    updateUI() {
        this.updateStatusIndicator();
        
        const startBtn = document.getElementById('start-bot');
        const stopBtn = document.getElementById('stop-bot');
        
        if (this.botStatus === 'online') {
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }

    simulateLoading(duration = 1000) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
        `;
        notification.textContent = message;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VIPBotDashboard();
});