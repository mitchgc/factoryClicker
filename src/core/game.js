// =============================================================================
// MAIN GAME CONTROLLER
// =============================================================================

/**
 * Main game controller that orchestrates all systems
 */
const Game = (function() {
    
    let gameLoop = null;
    let uiLoop = null;
    let lastUpdate = Date.now();
    
    /**
     * Initialize the game
     */
    function initialize() {
        console.log('🎮 Initializing City Production Tycoon...');
        
        // Initialize game state
        GameState.initialize();
        
        // Set up state change listeners
        GameState.addListener(handleStateChange);
        
        // Try to load saved game first
        if (GameState.load()) {
            console.log('✅ Loaded saved game');
        } else {
            console.log('✅ Started new game');
        }
        
        // Initialize UI after game state is ready
        initializeUI();
        
        
        // Start game loops
        startGameLoop();
        startUILoop();
        
        // Set up auto-save
        setupAutoSave();
        
        console.log('🎮 Game initialized successfully!');
        console.log('🏗️ Build structures to automate production!');
        console.log('⚡ Generate electricity to unlock advanced upgrades!');
    }
    
    /**
     * Initialize the user interface
     */
    function initializeUI() {
        // Initialize simple table UI
        if (typeof SimpleTableUI !== 'undefined') {
            SimpleTableUI.initialize();
        } else {
            // Fallback to production display
            updateProductionDisplay();
        }
        
        updateStatsDisplay();
        updateResearchDisplay();
        
        console.log('🖥️ UI initialized');
    }
    
    /**
     * Start the main game loop
     */
    function startGameLoop() {
        gameLoop = setInterval(() => {
            try {
                const now = Date.now();
                const deltaTime = (now - lastUpdate) / 1000; // Convert to seconds
                lastUpdate = now;
                
                // Update game systems
                ResourceSystem.update(deltaTime);
                
                
            } catch (error) {
                console.error('Game loop error:', error);
                if (GAME_CONFIG.DEBUG_MODE) {
                    NotificationSystem.show('Game loop error - check console', 'error', 10000);
                }
            }
            
        }, GAME_CONFIG.UPDATE_INTERVAL);
        
        console.log('⚙️ Game loop started');
    }
    
    /**
     * Start the UI update loop
     */
    function startUILoop() {
        uiLoop = setInterval(() => {
            // SimpleTableUI updates itself, so only update stats and research
            if (typeof SimpleTableUI === 'undefined') {
                updateProductionDisplay();
            }
            updateStatsDisplay();
            updateResearchDisplay();
        }, GAME_CONFIG.UPDATE_INTERVAL * 2); // Update UI less frequently
        
        console.log('🖥️ UI loop started');
    }
    
    /**
     * Set up auto-save
     */
    function setupAutoSave() {
        setInterval(() => {
            const state = GameState.getState();
            if (state.settings.autoSave) {
                GameState.save();
            }
        }, GAME_CONFIG.SAVE_INTERVAL);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            GameState.save();
        });
        
        console.log('💾 Auto-save configured');
    }
    
    /**
     * Handle game state changes
     * @param {string} type - Change type
     * @param {*} data - Change data
     */
    function handleStateChange(type, data) {
        // Handle specific state changes if needed
        switch (type) {
            case 'buildingAdded':
                // Building was added, check for new unlocks
                BuildingSystem.checkUnlocks();
                break;
            
            case 'researchReset':
                NotificationSystem.show('🔬 RESEARCH RESET COMPLETE! 🔬', 'success', 5000);
                break;
            
        }
    }
    
    /**
     * Update unified production display (combines resources + buildings)
     */
    function updateProductionDisplay() {
        const container = document.getElementById('production-grid');
        if (!container) return;
        
        const state = GameState.getState();
        
        // Get existing cards
        const existingCards = new Map();
        container.querySelectorAll('.production-card').forEach(card => {
            const resource = card.dataset.resource;
            if (resource) {
                existingCards.set(resource, card);
            }
        });
        
        // Update or create production cards for unlocked resources with smart sorting
        const unlockedResources = Object.entries(state.resources)
            .filter(([resourceKey]) => state.unlockedResources[resourceKey])
            .map(([resourceKey, amount]) => ({
                resourceKey,
                amount,
                rates: ResourceSystem.calculateRates(resourceKey)
            }))
            .sort((a, b) => getResourcePriority(b) - getResourcePriority(a)); // Higher priority first
        
        unlockedResources.forEach(({ resourceKey, amount, rates }) => {
            const existingCard = existingCards.get(resourceKey);
            
            if (existingCard) {
                // Update existing card
                ProductionCard.update(existingCard, amount, rates);
                existingCards.delete(resourceKey); // Mark as processed
            } else {
                // Create new card
                const card = ProductionCard.create(resourceKey, amount, rates);
                if (card) {
                    container.appendChild(card);
                }
            }
        });
        
        // Remove cards for resources that are no longer unlocked
        existingCards.forEach(card => {
            card.remove();
        });
        
        // Update unlock hint
        updateUnlockHint();
    }
    
    /**
     * Calculate resource priority for smart sorting (inspired by Factorio alerts)
     * @param {Object} resourceData - Resource data with rates and amount
     * @returns {number} Priority score (higher = more important)
     */
    function getResourcePriority(resourceData) {
        const { resourceKey, amount, rates } = resourceData;
        let priority = 0;
        
        // Critical shortage (highest priority)
        if (rates.net < 0 && amount < 10) {
            priority += 1000;
        }
        
        // General shortage
        if (rates.net < 0) {
            priority += 500;
        }
        
        // Low amounts of important resources
        if (amount < 20) {
            const importantResources = ['ironOre', 'ironPlates', 'coal', 'gears'];
            if (importantResources.includes(resourceKey)) {
                priority += 300;
            }
        }
        
        // Active production (player is engaged with this resource)
        if (rates.production > 0) {
            priority += 100;
        }
        
        // Recent unlocks (show new capabilities)
        const unlockOrder = {
            ironOre: 10, stone: 9, copperOre: 8, coal: 7,
            ironPlates: 6, copperPlates: 5, gears: 4,
            circuits: 3, steel: 2, engines: 1
        };
        priority += unlockOrder[resourceKey] || 0;
        
        return priority;
    }
    
    /**
     * Update unlock hint
     */
    function updateUnlockHint() {
        const hintElement = document.getElementById('unlock-hint');
        if (!hintElement) return;
        
        const hint = BuildingSystem.getUnlockHint();
        
        if (hint) {
            hintElement.textContent = hint;
            hintElement.classList.remove('hidden');
        } else {
            hintElement.classList.add('hidden');
        }
    }
    
    /**
     * Update statistics display
     */
    function updateStatsDisplay() {
        const container = document.getElementById('stats-panel');
        if (!container) return;
        
        const state = GameState.getState();
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${BuildingSystem.getTotalBuildingCount()}</div>
                    <div class="stat-label">Total Buildings</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">x${state.globalMultiplier.toFixed(2)}</div>
                    <div class="stat-label">Global Multiplier</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${formatNumber(state.resources.electricity || 0)}</div>
                    <div class="stat-label">Electricity</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${ResourceSystem.calculateRates('electricity').production.toFixed(1)}/s</div>
                    <div class="stat-label">Power Generation</div>
                </div>
            </div>
        `;
    }
    
    /**
     * Update research display
     */
    function updateResearchDisplay() {
        const container = document.getElementById('research-panel');
        if (!container) return;
        
        const stats = ResearchSystem.getStats();
        const canReset = stats.isResetWorthwhile;
        
        container.innerHTML = `
            <div class="research-info">
                <div class="research-currencies">
                    <div class="research-stat">
                        <strong>🔬 Research:</strong>
                        <span class="research-value">${formatNumber(stats.currentResearchPoints)}</span>
                    </div>
                    <div class="research-stat">
                        <strong>🏭 Production:</strong>
                        <span class="research-value">${formatNumber(stats.currentProductionTokens)}</span>
                    </div>
                    <div class="research-stat">
                        <strong>💡 Innovation:</strong>
                        <span class="research-value">${formatNumber(stats.currentInnovationPoints)}</span>
                    </div>
                    <div class="research-stat">
                        <strong>🤖 Automation:</strong>
                        <span class="research-value">${formatNumber(stats.currentAutomationCredits)}</span>
                    </div>
                </div>
                <div class="research-stat">
                    <strong>Total Bonus:</strong>
                    <span class="research-value">+${stats.bonusPercent.toFixed(1)}%</span>
                </div>
                <div class="research-stat">
                    <strong>Total Resets:</strong>
                    <span class="research-value">${stats.totalResets}</span>
                </div>
                <div class="research-stat">
                    <strong>Next Reset Gains:</strong>
                    <span class="research-value">
                        🔬${formatNumber(stats.resetPointsGain.researchPoints)} 
                        🏭${formatNumber(stats.resetPointsGain.productionTokens)} 
                        💡${formatNumber(stats.resetPointsGain.innovationPoints)} 
                        🤖${formatNumber(stats.resetPointsGain.automationCredits)}
                    </span>
                </div>
            </div>
            <button class="btn btn-research btn-full ${canReset ? 'research-ready' : ''}" 
                    ${!canReset ? 'disabled' : ''} 
                    onclick="handleResearchReset()">
                ${canReset ? 'PERFORM RESEARCH RESET' : 'NOT READY'}
            </button>
        `;
    }
    
    /**
     * Reset the game
     */
    function reset() {
        if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
            // Clear localStorage completely
            localStorage.removeItem(STORAGE_KEYS.SAVE_DATA);
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            localStorage.removeItem(STORAGE_KEYS.STATISTICS);
            
            GameState.reset();
            NotificationSystem.show('Game reset to factory system!', 'info');
        }
    }
    
    /**
     * Clear old save data and start fresh with factory system
     */
    function clearOldSave() {
        localStorage.removeItem(STORAGE_KEYS.SAVE_DATA);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.STATISTICS);
        GameState.reset();
        console.log('🧹 Cleared old save data - starting fresh with factory system!');
        NotificationSystem.show('Converted to Factory Automation System!', 'success', 5000);
    }
    
    /**
     * Save the game
     */
    function save() {
        if (GameState.save()) {
            NotificationSystem.show('Game saved!', 'success');
        } else {
            NotificationSystem.show('Failed to save game', 'error');
        }
    }
    
    // Global functions for HTML onclick handlers
    window.handleResearchReset = function() {
        if (ResearchSystem.performReset()) {
            // Research reset success is handled by state change listener
        } else {
            NotificationSystem.show('Research reset not beneficial yet', 'info');
        }
    };
    
    // Public API
    return {
        initialize,
        reset,
        clearOldSave,
        save,
        updateProductionDisplay,
        updateStatsDisplay,
        updateResearchDisplay
    };
})();