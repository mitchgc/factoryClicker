// =============================================================================
// UPGRADE SYSTEM
// =============================================================================

/**
 * Handles all upgrade-related operations
 */
const UpgradeSystem = (function() {
    
    /**
     * Check if an upgrade can be purchased
     * @param {string} upgradeId - Upgrade identifier
     * @returns {boolean} Can purchase
     */
    function canPurchase(upgradeId) {
        const state = GameState.getState();
        const upgrade = UPGRADES[upgradeId];
        
        if (!upgrade || state.purchasedUpgrades.includes(upgradeId)) return false;
        
        // Check unlock conditions
        if (!isUnlocked(upgradeId)) return false;
        
        // Check cost
        return ResourceSystem.canAfford(upgrade.cost);
    }
    
    /**
     * Purchase an upgrade
     * @param {string} upgradeId - Upgrade identifier
     * @returns {boolean} Success
     */
    function purchase(upgradeId) {
        if (!canPurchase(upgradeId)) return false;
        
        const upgrade = UPGRADES[upgradeId];
        
        // Deduct cost
        if (!ResourceSystem.deductCost(upgrade.cost)) return false;
        
        // Add to purchased upgrades
        GameState.purchaseUpgrade(upgradeId);
        
        return true;
    }
    
    /**
     * Check if an upgrade is unlocked
     * @param {string} upgradeId - Upgrade identifier
     * @returns {boolean} Is unlocked
     */
    function isUnlocked(upgradeId) {
        const upgrade = UPGRADES[upgradeId];
        if (!upgrade || !upgrade.unlockCondition) return true;
        
        const state = GameState.getState();
        const condition = upgrade.unlockCondition;
        
        // Check prerequisite upgrades
        if (condition.upgrades) {
            for (const requiredUpgradeId of condition.upgrades) {
                if (!state.purchasedUpgrades.includes(requiredUpgradeId)) {
                    return false;
                }
            }
        }
        
        // Check building requirements
        if (condition.buildings) {
            for (const [buildingKey, requiredCount] of Object.entries(condition.buildings)) {
                const building = state.buildings[buildingKey];
                if (!building || building.count < requiredCount) {
                    return false;
                }
            }
        }
        
        // Check total resets
        if (condition.totalResets && state.totalResets < condition.totalResets) {
            return false;
        }
        
        // Check resources
        if (condition.resources) {
            for (const [resource, amount] of Object.entries(condition.resources)) {
                if (state.resources[resource] < amount) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Get click power multiplier from upgrades
     * @returns {number} Multiplier
     */
    function getClickMultiplier() {
        const state = GameState.getState();
        let multiplier = 1;
        
        state.purchasedUpgrades.forEach(upgradeId => {
            const upgrade = UPGRADES[upgradeId];
            if (upgrade && upgrade.effect && upgrade.effect.clickMultiplier) {
                multiplier *= upgrade.effect.clickMultiplier;
            }
        });
        
        return multiplier;
    }
    
    /**
     * Get building-specific multiplier from upgrades
     * @param {string} buildingKey - Building type
     * @returns {number} Multiplier
     */
    function getBuildingMultiplier(buildingKey) {
        const state = GameState.getState();
        let multiplier = 1;
        
        state.purchasedUpgrades.forEach(upgradeId => {
            const upgrade = UPGRADES[upgradeId];
            if (upgrade && upgrade.effect && upgrade.effect.buildingMultiplier) {
                const buildingMult = upgrade.effect.buildingMultiplier[buildingKey];
                if (buildingMult) {
                    multiplier *= buildingMult;
                }
            }
        });
        
        return multiplier;
    }
    
    /**
     * Get global production multiplier from upgrades
     * @returns {number} Multiplier
     */
    function getGlobalMultiplier() {
        const state = GameState.getState();
        let multiplier = 1;
        
        state.purchasedUpgrades.forEach(upgradeId => {
            const upgrade = UPGRADES[upgradeId];
            if (upgrade && upgrade.effect && upgrade.effect.globalMultiplier) {
                multiplier *= upgrade.effect.globalMultiplier;
            }
        });
        
        return multiplier;
    }
    
    /**
     * Get research bonus multiplier from upgrades
     * @returns {number} Multiplier
     */
    function getResearchMultiplier() {
        const state = GameState.getState();
        let multiplier = 1;
        
        state.purchasedUpgrades.forEach(upgradeId => {
            const upgrade = UPGRADES[upgradeId];
            if (upgrade && upgrade.effect && upgrade.effect.researchMultiplier) {
                multiplier *= upgrade.effect.researchMultiplier;
            }
        });
        
        return multiplier;
    }
    
    /**
     * Get electricity cost from upgrades for a building
     * @param {string} buildingKey - Building type
     * @returns {number} Electricity cost per second
     */
    function getElectricityCost(buildingKey) {
        const state = GameState.getState();
        let electricityCost = 0;
        
        state.purchasedUpgrades.forEach(upgradeId => {
            const upgrade = UPGRADES[upgradeId];
            if (upgrade && upgrade.effect && upgrade.effect.electricityCost) {
                const cost = upgrade.effect.electricityCost[buildingKey];
                if (cost) {
                    electricityCost += cost;
                }
            }
        });
        
        return electricityCost;
    }
    
    /**
     * Get upgrades available for purchase
     * @param {string} category - Optional category filter
     * @returns {Array} Available upgrades
     */
    function getAvailableUpgrades(category = null) {
        const upgrades = [];
        
        Object.entries(UPGRADES).forEach(([upgradeId, upgrade]) => {
            if (category && upgrade.category !== category) return;
            if (!isUnlocked(upgradeId)) return;
            
            upgrades.push({
                id: upgradeId,
                ...upgrade,
                canAfford: canPurchase(upgradeId),
                isPurchased: GameState.getState().purchasedUpgrades.includes(upgradeId)
            });
        });
        
        return upgrades;
    }
    
    /**
     * Get upgrades for a specific building
     * @param {string} buildingKey - Building type
     * @returns {Array} Building upgrades
     */
    function getBuildingUpgrades(buildingKey) {
        return getAvailableUpgrades().filter(upgrade => {
            // Include upgrades that affect this building
            if (upgrade.building === buildingKey) return true;
            
            // Include click upgrades for lumbermill (wood gathering)
            if (buildingKey === 'lumbermill' && upgrade.category === 'click') return true;
            
            // Include global upgrades for workshop
            if (buildingKey === 'workshop' && upgrade.category === 'global') return true;
            
            return false;
        });
    }
    
    // Public API
    return {
        canPurchase,
        purchase,
        purchaseUpgrade: purchase, // Alias for compatibility
        isUnlocked,
        isUpgradeAvailable: isUnlocked, // Alias for compatibility
        getClickMultiplier,
        getBuildingMultiplier,
        getGlobalMultiplier,
        getResearchMultiplier,
        getAvailableUpgrades,
        getBuildingUpgrades,
        getElectricityCost
    };
})();