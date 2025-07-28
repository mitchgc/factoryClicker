// =============================================================================
// RESEARCH SYSTEM
// =============================================================================

/**
 * Handles the research (prestige) system with multiple currencies
 */
const ResearchSystem = (function() {
    
    /**
     * Calculate how many reset research points the player would gain
     * @returns {Object} Multiple research currencies from reset
     */
    function calculateResetPoints() {
        const state = GameState.getState();
        const totalProduction = Object.values(state.lifetimeProduction)
            .reduce((sum, amount) => sum + (amount || 0), 0);
        
        const basePoints = Math.floor(Math.sqrt(totalProduction / GAME_CONFIG.RESEARCH_RESET_COST_BASE));
        
        // Calculate different currency rewards based on different achievements
        const buildingCount = Object.values(state.buildings).reduce((sum, building) => sum + building.count, 0);
        const buildingTypes = Object.values(state.buildings).filter(building => building.count > 0).length;
        const alternativeBuildings = Object.entries(state.buildings)
            .filter(([key, building]) => building.count > 0 && BUILDINGS[key]?.isAlternative)
            .length;
        
        return {
            researchPoints: basePoints,
            productionTokens: Math.floor(totalProduction / (GAME_CONFIG.RESEARCH_RESET_COST_BASE * 2)),
            innovationPoints: Math.floor(buildingTypes * alternativeBuildings * 0.5),
            automationCredits: Math.floor(buildingCount / 10)
        };
    }
    
    /**
     * Check if research reset is beneficial
     * @returns {boolean} Worth resetting
     */
    function isResetWorthwhile() {
        const resetPoints = calculateResetPoints();
        return Object.values(resetPoints).some(points => points > 0);
    }
    
    /**
     * Perform a research reset
     * @returns {boolean} Success
     */
    function performReset() {
        if (!isResetWorthwhile()) return false;
        
        const points = calculateResetPoints();
        GameState.performResearchReset(points);
        
        return true;
    }
    
    /**
     * Get current research bonus multiplier from accumulated research points
     * @returns {number} Bonus multiplier
     */
    function getResearchBonus() {
        const state = GameState.getState();
        const researchMultiplier = UpgradeSystem.getResearchMultiplier();
        
        // Different currencies provide different bonuses
        let totalBonus = 1;
        totalBonus += (state.researchPoints || 0) * GAME_CONFIG.RESEARCH_MULTIPLIER * researchMultiplier;
        totalBonus += (state.productionTokens || 0) * 0.005; // 0.5% per token for production bonus
        totalBonus += (state.innovationPoints || 0) * 0.003; // 0.3% per point for innovation bonus
        totalBonus += (state.automationCredits || 0) * 0.002; // 0.2% per credit for automation bonus
        
        return totalBonus;
    }
    
    /**
     * Get research statistics for display
     * @returns {Object} Research stats
     */
    function getStats() {
        const state = GameState.getState();
        const bonus = getResearchBonus();
        const nextResetPoints = calculateResetPoints();
        
        return {
            // Current currencies
            currentResearchPoints: state.researchPoints || 0,
            currentProductionTokens: state.productionTokens || 0,
            currentInnovationPoints: state.innovationPoints || 0,
            currentAutomationCredits: state.automationCredits || 0,
            
            // Reset info
            totalResets: state.totalResets,
            currentBonus: bonus,
            bonusPercent: (bonus - 1) * 100,
            nextResetPoints: nextResetPoints,
            resetPointsGain: nextResetPoints,
            isResetWorthwhile: isResetWorthwhile()
        };
    }
    
    /**
     * Get research upgrades
     * @returns {Array} Research upgrades
     */
    function getUpgrades() {
        return UpgradeSystem.getAvailableUpgrades('research');
    }
    
    /**
     * Calculate time since last reset
     * @returns {number} Time in milliseconds
     */
    function getTimeSinceLastReset() {
        const state = GameState.getState();
        return Date.now() - (state.stats.lastResetTime || state.stats.gameStartTime);
    }
    
    /**
     * Get research efficiency (points per time)
     * @returns {number} Points per hour
     */
    function getEfficiency() {
        const state = GameState.getState();
        if (state.totalResets === 0) return 0;
        
        const totalTime = Date.now() - state.stats.gameStartTime;
        const hoursPlayed = totalTime / (1000 * 60 * 60);
        
        return state.researchPoints / hoursPlayed;
    }
    
    /**
     * Check if player can afford a research upgrade
     * @param {number} cost - Research points cost
     * @returns {boolean} Can afford
     */
    function canAffordUpgrade(cost) {
        const state = GameState.getState();
        return state.researchPoints >= cost;
    }
    
    /**
     * Purchase a research upgrade
     * @param {string} upgradeId - Upgrade ID
     * @param {number} cost - Research points cost
     * @returns {boolean} Success
     */
    function purchaseUpgrade(upgradeId, cost) {
        if (!canAffordUpgrade(cost)) return false;
        
        const state = GameState.getState();
        GameState.updateState('researchPoints', state.researchPoints - cost);
        GameState.purchaseUpgrade(upgradeId);
        
        return true;
    }
    
    // Public API
    return {
        calculateResetPoints,
        isResetWorthwhile,
        performReset,
        getResearchBonus,
        getStats,
        getUpgrades,
        getTimeSinceLastReset,
        getEfficiency,
        canAffordUpgrade,
        purchaseUpgrade
    };
})();