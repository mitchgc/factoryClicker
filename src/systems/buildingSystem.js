// =============================================================================
// BUILDING SYSTEM
// =============================================================================

/**
 * Handles all building-related operations
 */
const BuildingSystem = (function() {
    
    /**
     * Check if a building can be built
     * @param {string} buildingKey - Building type
     * @returns {boolean} Can build
     */
    function canBuild(buildingKey) {
        const state = GameState.getState();
        const building = state.buildings[buildingKey];
        const definition = BUILDINGS[buildingKey];
        
        if (!building || !definition || !building.unlocked) return false;
        
        // Check cost
        const cost = getBuildingCost(buildingKey, building.count);
        if (!ResourceSystem.canAfford(cost)) return false;
        
        // Check if consumption can be sustained
        if (!ResourceSystem.canSustainBuilding(buildingKey)) return false;
        
        return true;
    }
    
    /**
     * Build a building
     * @param {string} buildingKey - Building type
     * @returns {boolean} Success
     */
    function build(buildingKey) {
        if (!canBuild(buildingKey)) return false;
        
        const state = GameState.getState();
        const building = state.buildings[buildingKey];
        const cost = getBuildingCost(buildingKey, building.count);
        
        // Deduct cost
        if (!ResourceSystem.deductCost(cost)) return false;
        
        // Add building
        GameState.addBuilding(buildingKey);
        
        // Check for unlocks
        checkUnlocks();
        
        // Update global multiplier if workshop
        updateGlobalMultiplier();
        
        return true;
    }
    
    /**
     * Get the cost to build a building (with scaling)
     * @param {string} buildingKey - Building type
     * @param {number} currentCount - Current building count
     * @returns {Object} Cost object
     */
    function getBuildingCost(buildingKey, currentCount) {
        const definition = BUILDINGS[buildingKey];
        if (!definition) return {};
        
        const multiplier = Math.pow(GAME_CONFIG.BUILDING_COST_MULTIPLIER, currentCount);
        const cost = {};
        
        Object.entries(definition.baseCost).forEach(([resource, amount]) => {
            cost[resource] = Math.floor(amount * multiplier);
        });
        
        return cost;
    }
    
    /**
     * Check if a building can be upgraded
     * @param {string} buildingKey - Building type
     * @returns {boolean} Can upgrade
     */
    function canUpgrade(buildingKey) {
        const state = GameState.getState();
        const building = state.buildings[buildingKey];
        const definition = BUILDINGS[buildingKey];
        
        if (!building || !definition || building.count === 0) return false;
        
        const cost = getUpgradeCost(buildingKey, building.efficiency);
        return ResourceSystem.canAfford(cost);
    }
    
    /**
     * Upgrade a building's efficiency
     * @param {string} buildingKey - Building type
     * @returns {boolean} Success
     */
    function upgrade(buildingKey) {
        if (!canUpgrade(buildingKey)) return false;
        
        const state = GameState.getState();
        const building = state.buildings[buildingKey];
        const cost = getUpgradeCost(buildingKey, building.efficiency);
        
        // Deduct cost
        if (!ResourceSystem.deductCost(cost)) return false;
        
        // Upgrade efficiency
        const newEfficiency = building.efficiency * GAME_CONFIG.UPGRADE_EFFICIENCY_BONUS;
        GameState.updateState(`buildings.${buildingKey}.efficiency`, newEfficiency);
        
        return true;
    }
    
    /**
     * Get the cost to upgrade a building
     * @param {string} buildingKey - Building type
     * @param {number} currentEfficiency - Current efficiency
     * @returns {Object} Cost object
     */
    function getUpgradeCost(buildingKey, currentEfficiency) {
        const definition = BUILDINGS[buildingKey];
        if (!definition || !definition.upgradeCost) return {};
        
        // Calculate multiplier based on efficiency level
        const upgradeCount = Math.max(0, Math.floor(currentEfficiency - 1));
        const multiplier = Math.pow(GAME_CONFIG.UPGRADE_COST_MULTIPLIER, upgradeCount);
        const cost = {};
        
        Object.entries(definition.upgradeCost).forEach(([resource, amount]) => {
            cost[resource] = Math.floor(amount * multiplier);
        });
        
        return cost;
    }
    
    /**
     * Check and unlock new buildings
     */
    function checkUnlocks() {
        const state = GameState.getState();
        
        Object.entries(BUILDINGS).forEach(([buildingKey, definition]) => {
            const building = state.buildings[buildingKey];
            
            if (!building || building.unlocked || !definition.unlockRequirement) return;
            
            const requirement = definition.unlockRequirement;
            const requiredBuilding = state.buildings[requirement.building];
            
            if (requiredBuilding && requiredBuilding.count >= requirement.count) {
                GameState.updateState(`buildings.${buildingKey}.unlocked`, true);
                
                // Unlock associated resources
                Object.keys(definition.produces).forEach(resource => {
                    ResourceSystem.unlockResource(resource);
                });
            }
        });
    }
    
    /**
     * Update global multiplier from workshops
     */
    function updateGlobalMultiplier() {
        const state = GameState.getState();
        const workshop = state.buildings.workshop;
        
        if (workshop && BUILDINGS.workshop.globalBonus) {
            const bonus = workshop.count * BUILDINGS.workshop.globalBonus;
            const newMultiplier = 1 + bonus;
            GameState.updateState('globalMultiplier', newMultiplier);
        }
    }
    
    /**
     * Get building tier (for UI organization)
     * @param {string} buildingKey - Building type
     * @returns {number} Tier number
     */
    function getBuildingTier(buildingKey) {
        const tiers = {
            // Tier 1: Basic extraction
            ironMine: 1,
            copperMine: 1,
            coalMine: 1,
            stoneQuarry: 1,
            
            // Tier 2: Basic processing
            stoneFurnace: 2,
            copperFurnace: 2,
            manualGearPress: 2,
            waterPump: 2,
            
            // Tier 3: Steam power and automation
            steamEngine: 3,
            gearAssembler: 3,
            cableAssembler: 3,
            
            // Tier 4: Electric mining
            electricIronDrill: 4,
            electricCopperDrill: 4,
            electricCoalDrill: 4,
            electricStoneDrill: 4,
            
            // Tier 5: Advanced processing
            circuitAssembler: 5,
            steelFurnace: 5,
            researchLab: 5,
            
            // Tier 6: High-tech manufacturing
            engineAssembler: 6,
            solarPanel: 6,
            pumpjack: 6,
            
            // Tier 7: Automation and production
            assemblingMachine: 7,
            chemicalPlant: 7,
            processingUnit: 7,
            
            // Tier 8: Advanced automation
            robotFactory: 8,
            advancedLab: 8
        };
        
        return tiers[buildingKey] || 1;
    }

    /**
     * Get buildings by tier (for UI organization)
     * @param {number} tier - Tier number
     * @returns {Array} Buildings in tier
     */
    function getBuildingsByTier(tier) {
        const state = GameState.getState();
        const buildings = [];
        
        Object.entries(state.buildings).forEach(([key, building]) => {
            if (getBuildingTier(key) === tier && building.unlocked) {
                buildings.push({
                    key,
                    building,
                    definition: BUILDINGS[key]
                });
            }
        });
        
        return buildings;
    }
    
    /**
     * Get unlock hint for next building
     * @returns {string} Hint message
     */
    function getUnlockHint() {
        const state = GameState.getState();
        
        // Find the next locked building
        const buildingOrder = [
            'ironMine', 'copperMine', 'coalMine', 'stoneQuarry', 'stoneFurnace', 'copperFurnace', 
            'manualGearPress', 'waterPump', 'steamEngine', 'gearAssembler', 'cableAssembler',
            'electricIronDrill', 'electricCopperDrill', 'electricCoalDrill', 'electricStoneDrill',
            'circuitAssembler', 'steelFurnace', 'researchLab', 'engineAssembler', 'solarPanel', 
            'pumpjack', 'assemblingMachine', 'chemicalPlant', 'processingUnit', 'robotFactory', 'advancedLab'
        ];
        
        for (const buildingKey of buildingOrder) {
            const building = state.buildings[buildingKey];
            if (building && !building.unlocked) {
                const definition = BUILDINGS[buildingKey];
                const requirement = definition?.unlockRequirement;
                
                if (requirement) {
                    const requiredBuilding = BUILDINGS[requirement.building];
                    return `🔒 Build ${requirement.count} ${requiredBuilding.name}${requirement.count > 1 ? 's' : ''} to unlock ${definition.name}`;
                }
            }
        }
        
        return ''; // All buildings unlocked
    }
    
    /**
     * Get total building count (for stats)
     * @returns {number} Total buildings
     */
    function getTotalBuildingCount() {
        const state = GameState.getState();
        return Object.values(state.buildings).reduce((sum, building) => sum + building.count, 0);
    }
    
    /**
     * Get building production info for display (using bottleneck calculations)
     * @param {string} buildingKey - Building type
     * @returns {Object} Production info
     */
    function getBuildingProductionInfo(buildingKey) {
        const state = GameState.getState();
        const building = state.buildings[buildingKey];
        const definition = BUILDINGS[buildingKey];
        
        if (!building || !definition || building.count === 0) {
            return { produces: {}, consumes: {}, globalBonus: 0 };
        }
        
        const info = {
            produces: {},
            consumes: {},
            globalBonus: 0
        };
        
        // Calculate rates for this specific building with bottlenecks
        const baseRate = building.count * definition.baseProduction * building.efficiency;
        const buildingMultiplier = UpgradeSystem.getBuildingMultiplier(buildingKey);
        const globalMultiplier = UpgradeSystem.getGlobalMultiplier();
        const researchBonus = ResearchSystem.getResearchBonus();
        const totalMultiplier = state.globalMultiplier * buildingMultiplier * globalMultiplier * researchBonus;
        
        // Calculate limiting factor for this building specifically
        let limitingFactor = 1;
        Object.entries(definition.consumes).forEach(([inputResource, consumptionRate]) => {
            const requiredPerSecond = baseRate * consumptionRate * totalMultiplier;
            const availableResource = state.resources[inputResource];
            
            if (requiredPerSecond > 0) {
                const availabilityRatio = Math.min(1, availableResource / requiredPerSecond);
                limitingFactor = Math.min(limitingFactor, availabilityRatio);
            }
        });
        
        // Apply rates with limiting factor
        Object.entries(definition.produces).forEach(([resource, rate]) => {
            const actualRate = baseRate * rate * totalMultiplier * limitingFactor;
            info.produces[resource] = actualRate;
        });
        
        Object.entries(definition.consumes).forEach(([resource, rate]) => {
            const actualRate = baseRate * rate * totalMultiplier * limitingFactor;
            info.consumes[resource] = actualRate;
        });
        
        // Global bonus
        if (definition.globalBonus) {
            info.globalBonus = building.count * definition.globalBonus;
        }
        
        return info;
    }
    
    // Public API
    return {
        canBuild,
        build,
        getBuildingCost,
        canUpgrade,
        upgrade,
        getUpgradeCost,
        checkUnlocks,
        updateGlobalMultiplier,
        getBuildingTier,
        getBuildingsByTier,
        getUnlockHint,
        getTotalBuildingCount,
        getBuildingProductionInfo
    };
})();