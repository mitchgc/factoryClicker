// =============================================================================
// RESOURCE SYSTEM
// =============================================================================

/**
 * Handles all resource-related calculations and operations
 */
const ResourceSystem = (function() {
    
    /**
     * Calculate production and consumption rates for a resource (with bottlenecks)
     * @param {string} resource - Resource type
     * @returns {Object} Production, consumption, and net rates
     */
    function calculateRates(resource) {
        const state = GameState.getState();
        
        // Use bottleneck system to get realistic rates per second
        const results = calculateBottleneckedProductionAndConsumption(1);
        
        return {
            production: results.production[resource] || 0,
            consumption: results.consumption[resource] || 0,
            net: (results.production[resource] || 0) - (results.consumption[resource] || 0)
        };
    }
    
    
    /**
     * Update all resources based on delta time with bottleneck system
     * @param {number} deltaTime - Time elapsed in seconds
     */
    function update(deltaTime) {
        const state = GameState.getState();
        const updates = {};
        
        // Calculate actual production and consumption with bottlenecks
        const results = calculateBottleneckedProductionAndConsumption(deltaTime);
        
        // Apply the results
        Object.keys(state.resources).forEach(resource => {
            const production = results.production[resource] || 0;
            const consumption = results.consumption[resource] || 0;
            const change = production - consumption;
            
            if (change !== 0) {
                const newValue = Math.max(0, state.resources[resource] + change);
                updates[`resources.${resource}`] = newValue;
                
                // Track lifetime production
                if (production > 0) {
                    const currentLifetime = state.lifetimeProduction[resource] || 0;
                    updates[`lifetimeProduction.${resource}`] = currentLifetime + production;
                }
            }
        });
        
        // Apply updates
        if (Object.keys(updates).length > 0) {
            GameState.batchUpdate(updates);
        }
    }
    
    /**
     * Calculate bottlenecked production and consumption in one pass
     * @param {number} deltaTime - Time elapsed in seconds
     * @returns {Object} Production and consumption rates after bottlenecks
     */
    function calculateBottleneckedProductionAndConsumption(deltaTime) {
        const state = GameState.getState();
        const production = {};
        const consumption = {};
        
        // Initialize all resources to 0
        Object.keys(state.resources).forEach(resource => {
            production[resource] = 0;
            consumption[resource] = 0;
        });
        
        // Process each building
        Object.entries(state.buildings).forEach(([buildingKey, building]) => {
            if (building.count === 0) return;
            
            const definition = BUILDINGS[buildingKey];
            if (!definition) return;
            
            // Calculate base rates
            const baseRate = building.count * definition.baseProduction * building.efficiency;
            const buildingMultiplier = UpgradeSystem.getBuildingMultiplier(buildingKey);
            const globalMultiplier = UpgradeSystem.getGlobalMultiplier();
            const researchBonus = ResearchSystem.getResearchBonus();
            
            
            const totalMultiplier = state.globalMultiplier * buildingMultiplier * globalMultiplier * researchBonus;
            
            // Find limiting factor based on available inputs
            let limitingFactor = 1;
            
            // Check base resource consumption
            Object.entries(definition.consumes).forEach(([inputResource, consumptionRate]) => {
                const consumptionMultiplier = state.globalMultiplier * buildingMultiplier * globalMultiplier * researchBonus;
                const requiredPerSecond = baseRate * consumptionRate * consumptionMultiplier;
                const requiredForPeriod = requiredPerSecond * deltaTime;
                const availableResource = state.resources[inputResource];
                
                if (requiredForPeriod > 0) {
                    // How much of the required resources do we actually have?
                    const availabilityRatio = Math.min(1, availableResource / requiredForPeriod);
                    limitingFactor = Math.min(limitingFactor, availabilityRatio);
                } else if (requiredForPeriod === 0) {
                    // No consumption required, no limiting factor
                    limitingFactor = Math.min(limitingFactor, 1);
                }
            });
            
            // Check electricity consumption from upgrades
            const electricityCost = UpgradeSystem.getElectricityCost(buildingKey);
            if (electricityCost > 0) {
                const consumptionMultiplier = state.globalMultiplier * buildingMultiplier * globalMultiplier * researchBonus;
                const requiredElectricityPerSecond = baseRate * electricityCost * consumptionMultiplier;
                const requiredElectricityForPeriod = requiredElectricityPerSecond * deltaTime;
                const availableElectricity = state.resources.electricity || 0;
                
                if (requiredElectricityForPeriod > 0) {
                    const electricityAvailabilityRatio = Math.min(1, availableElectricity / requiredElectricityForPeriod);
                    limitingFactor = Math.min(limitingFactor, electricityAvailabilityRatio);
                }
            }
            
            // Apply production with limiting factor
            Object.entries(definition.produces).forEach(([outputResource, productionRate]) => {
                const actualProduction = baseRate * productionRate * totalMultiplier * limitingFactor * deltaTime;
                production[outputResource] += actualProduction;
            });
            
            // Apply consumption with same limiting factor (ensures 1:1 ratios)
            Object.entries(definition.consumes).forEach(([inputResource, consumptionRate]) => {
                const actualConsumption = baseRate * consumptionRate * totalMultiplier * limitingFactor * deltaTime;
                consumption[inputResource] += actualConsumption;
            });
            
            // Add electricity consumption from upgrades
            const electricityCost = UpgradeSystem.getElectricityCost(buildingKey);
            if (electricityCost > 0) {
                const electricityConsumption = baseRate * electricityCost * totalMultiplier * limitingFactor * deltaTime;
                consumption.electricity = (consumption.electricity || 0) + electricityConsumption;
            }
        });
        
        return { production, consumption };
    }
    
    /**
     * Check if player can afford a cost
     * @param {Object} cost - Cost object
     * @param {number} multiplier - Cost multiplier
     * @returns {boolean} Can afford
     */
    function canAfford(cost, multiplier = 1) {
        if (!cost || typeof cost !== 'object') return true;
        if (typeof multiplier !== 'number' || multiplier < 0) multiplier = 1;
        
        const state = GameState.getState();
        
        return Object.entries(cost).every(([resource, amount]) => {
            if (typeof amount !== 'number' || amount < 0) return false;
            const required = amount * multiplier;
            
            // Handle special research currencies
            if (resource === 'researchPoints') {
                return (state.researchPoints || 0) >= required;
            }
            if (resource === 'productionTokens') {
                return (state.productionTokens || 0) >= required;
            }
            if (resource === 'innovationPoints') {
                return (state.innovationPoints || 0) >= required;
            }
            if (resource === 'automationCredits') {
                return (state.automationCredits || 0) >= required;
            }
            
            // Handle regular resources - ensure they exist and have a value
            const currentAmount = state.resources[resource];
            if (currentAmount === undefined || currentAmount === null) {
                console.warn(`Resource ${resource} not found in state.resources, cannot afford cost of ${required}`);
                return false; // Resource doesn't exist, can't afford
            }
            
            // Check if resource is unlocked for player visibility
            if (!state.unlockedResources[resource]) {
                console.warn(`Resource ${resource} not unlocked yet, cannot afford cost of ${required}`);
                return false;
            }
            
            // Use Math.floor to avoid floating point precision issues
            const canAffordAmount = Math.floor(currentAmount) >= Math.ceil(required);
            if (GAME_CONFIG.DEBUG_MODE && !canAffordAmount) {
                console.log(`Cannot afford ${resource}: have ${currentAmount}, need ${required}`);
            }
            return canAffordAmount;
        });
    }
    
    /**
     * Deduct a cost from resources
     * @param {Object} cost - Cost object
     * @param {number} multiplier - Cost multiplier
     * @returns {boolean} Success
     */
    function deductCost(cost, multiplier = 1) {
        if (!canAfford(cost, multiplier)) return false;
        
        const state = GameState.getState();
        const updates = {};
        
        Object.entries(cost).forEach(([resource, amount]) => {
            const required = amount * multiplier;
            
            // Handle special research currencies
            if (resource === 'researchPoints') {
                updates['researchPoints'] = (state.researchPoints || 0) - required;
            } else if (resource === 'productionTokens') {
                updates['productionTokens'] = (state.productionTokens || 0) - required;
            } else if (resource === 'innovationPoints') {
                updates['innovationPoints'] = (state.innovationPoints || 0) - required;
            } else if (resource === 'automationCredits') {
                updates['automationCredits'] = (state.automationCredits || 0) - required;
            } else {
                // Handle regular resources
                const currentAmount = state.resources[resource] || 0;
                updates[`resources.${resource}`] = Math.max(0, currentAmount - required);
            }
        });
        
        GameState.batchUpdate(updates);
        return true;
    }
    
    
    /**
     * Unlock a resource
     * @param {string} resource - Resource to unlock
     */
    function unlockResource(resource) {
        GameState.updateState(`unlockedResources.${resource}`, true);
    }
    
    /**
     * Get total resource production rate (for achievements)
     * @returns {number} Total production per second
     */
    function getTotalProductionRate() {
        const state = GameState.getState();
        let total = 0;
        
        Object.keys(state.resources).forEach(resource => {
            const rates = calculateRates(resource);
            if (rates.production > 0) {
                total += rates.production;
            }
        });
        
        return total;
    }
    
    /**
     * Get total resources (for revolution calculation)
     * @returns {number} Sum of all resources
     */
    function getTotalResources() {
        const state = GameState.getState();
        return Object.values(state.resources).reduce((sum, amount) => sum + amount, 0);
    }
    
    /**
     * Check if consumption can be sustained
     * @param {string} buildingKey - Building to check
     * @returns {boolean} Can sustain
     */
    function canSustainBuilding(buildingKey) {
        const definition = BUILDINGS[buildingKey];
        if (!definition || Object.keys(definition.consumes).length === 0) return true;
        
        return Object.entries(definition.consumes).every(([resource, rate]) => {
            const rates = calculateRates(resource);
            // Check if adding this building would make net negative
            return rates.net - rate >= 0;
        });
    }
    
    // Public API
    return {
        calculateRates,
        update,
        canAfford,
        deductCost,
        unlockResource,
        getTotalProductionRate,
        getTotalResources,
        canSustainBuilding,
        calculateBottleneckedProductionAndConsumption
    };
})();