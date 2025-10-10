class AIJournal {
    constructor() {
        this.enhancements = [];
        this.currentIteration = 0;
        this.initializeElements();
        this.bindEvents();
        this.loadStoredData();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById('api-key');
        this.userTextArea = document.getElementById('user-text');
        this.refineBtn = document.getElementById('refine-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.enhancementsList = document.getElementById('refinements-list');
        this.loadingOverlay = document.getElementById('loading-overlay');
    }

    bindEvents() {
        this.refineBtn.addEventListener('click', () => this.enhanceText());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        
        // Auto-save API key
        this.apiKeyInput.addEventListener('input', () => {
            localStorage.setItem('aijournal_api_key', this.apiKeyInput.value);
        });

        // Auto-save text content
        this.userTextArea.addEventListener('input', () => {
            localStorage.setItem('aijournal_user_text', this.userTextArea.value);
        });


        // Enter key shortcuts
        this.userTextArea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.enhanceText();
            }
        });
    }

    loadStoredData() {
        const storedApiKey = localStorage.getItem('aijournal_api_key');
        const storedUserText = localStorage.getItem('aijournal_user_text');
        const storedEnhancements = localStorage.getItem('aijournal_enhancements');

        if (storedApiKey) this.apiKeyInput.value = storedApiKey;
        if (storedUserText) this.userTextArea.value = storedUserText;
        
        if (storedEnhancements) {
            try {
                this.enhancements = JSON.parse(storedEnhancements);
                this.currentIteration = this.enhancements.length;
                this.renderEnhancements();
            } catch (e) {
                console.error('Error loading stored enhancements:', e);
            }
        }
    }

    saveEnhancements() {
        localStorage.setItem('aijournal_enhancements', JSON.stringify(this.enhancements));
    }

    async enhanceText() {
        const apiKey = this.apiKeyInput.value.trim();
        const userText = this.userTextArea.value.trim();

        if (!apiKey) {
            this.showError('Please enter your Claude API key');
            return;
        }

        if (!userText) {
            this.showError('Please enter some text to enhance');
            return;
        }


        this.showLoading(true);
        this.refineBtn.disabled = true;

        try {
            const textToEnhance = this.currentIteration === 0 ? userText : this.enhancements[this.enhancements.length - 1].content;
            const enhancedText = await this.callClaudeAPI(apiKey, textToEnhance);
            
            this.currentIteration++;
            const enhancement = {
                id: this.currentIteration,
                content: enhancedText,
                timestamp: new Date().toLocaleString(),
                originalText: this.currentIteration === 1 ? userText : null
            };

            this.enhancements.push(enhancement);
            this.saveEnhancements();
            this.renderEnhancements();
            
            this.showSuccess('Text enhanced successfully!');
        } catch (error) {
            console.error('Error enhancing text:', error);
            this.showError(`Error: ${error.message}`);
        } finally {
            this.showLoading(false);
            this.refineBtn.disabled = false;
        }
    }

    async callClaudeAPI(apiKey, text) {
        // Documentation: https://docs.anthropic.com/en/api/messages
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                system: "You are a helpful writing assistant. Your task is to refine and improve the user's text while maintaining their original intent and voice. Focus on clarity, grammar, style, and overall readability. Provide only the refined text without any additional commentary or explanation.",
                messages: [
                    {
                        role: 'user',
                        content: `Please enhance and improve the following text:\n\n${text}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    renderEnhancements() {
        if (this.enhancements.length === 0) {
            this.enhancementsList.innerHTML = `
                <div class="placeholder">
                    <p>Your text enhancements will appear here...</p>
                </div>
            `;
            return;
        }

        this.enhancementsList.innerHTML = this.enhancements.map(enhancement => `
            <div class="refinement-item">
                <div class="refinement-header">
                    <div class="refinement-number">Enhancement ${enhancement.id}</div>
                    <div class="refinement-timestamp">${enhancement.timestamp}</div>
                </div>
                ${enhancement.originalText ? `
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: var(--text-secondary); font-size: 12px; text-transform: uppercase;">Original Text:</strong>
                        <div class="refinement-content" style="border-left-color: var(--text-secondary); margin-top: 0.5rem;">${this.escapeHtml(enhancement.originalText)}</div>
                    </div>
                ` : ''}
                <div class="refinement-content">${this.escapeHtml(enhancement.content)}</div>
            </div>
        `).join('');

        // Scroll to the latest enhancement
        const latestItem = this.enhancementsList.lastElementChild;
        if (latestItem) {
            latestItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearAll() {
        if (this.enhancements.length > 0 && !confirm('Are you sure you want to clear all enhancements? This cannot be undone.')) {
            return;
        }

        this.enhancements = [];
        this.currentIteration = 0;
        this.userTextArea.value = '';
        
        localStorage.removeItem('aijournal_enhancements');
        localStorage.removeItem('aijournal_user_text');
        
        this.renderEnhancements();
        this.showSuccess('All content cleared');
    }

    showLoading(show) {
        this.loadingOverlay.classList.toggle('active', show);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '1001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'error' ? 'var(--error)' : 'var(--success)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIJournal();
});