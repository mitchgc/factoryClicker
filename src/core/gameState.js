// =============================================================================
// GAME STATE MANAGEMENT
// =============================================================================

/**
 * Central game state manager
 * This module handles all game state operations and ensures data integrity
 */
const GameState = (function() {
    // Private state object
    let state = null;
    
    // State change listeners
    const listeners = new Set();
    
    /**
     * Initialize game state with default values
     */
    function initialize() {
        state = {
            // Version for save compatibility
            version: GAME_VERSION,
            
            // Resources - Pure Factory System
            resources: {
                // Raw materials (mined)
                ironOre: GAME_CONFIG.STARTING_IRON_ORE,
                copperOre: 0,
                coal: 0,
                stone: GAME_CONFIG.STARTING_STONE,
                oil: 0,
                water: 0,
                
                // Processed materials (smelted/refined)
                ironPlates: 0,
                copperPlates: 0,
                steel: 0,
                plastic: 0,
                
                // Intermediate components
                gears: 0,
                copperCables: 0,
                circuits: 0,
                engines: 0,
                
                // Advanced products
                assemblers: 0,
                computers: 0,
                robots: 0,
                
                // Power & utility
                electricity: 0,
                
                // Research currencies
                researchPoints: 0,
                productionTokens: 0,
                innovationPoints: 0,
                automationCredits: 0
            },
            
            // Buildings
            buildings: {},
            
            // Game progression
            unlockedResources: {
                // Start with basic mining - all raw materials from burner miner
                ironOre: true,
                copperOre: true,
                coal: true,
                stone: true,
                oil: false,
                water: false,
                
                // Processed materials unlock through buildings
                ironPlates: false,
                copperPlates: false,
                steel: false,
                plastic: false,
                
                // Intermediate components
                gears: false,
                copperCables: false,
                circuits: false,
                engines: false,
                
                // Advanced products
                assemblers: false,
                computers: false,
                robots: false,
                
                // Power & utility
                electricity: false,
                
                // Research currencies
                researchPoints: false,
                productionTokens: false,
                innovationPoints: false,
                automationCredits: false
            },
            
            // Player stats
            clickPower: 1,
            globalMultiplier: 1,
            
            // Purchased upgrades
            purchasedUpgrades: [],
            
            // Research system (multi-currency prestige)
            researchPoints: 0,
            productionTokens: 0,
            innovationPoints: 0,
            automationCredits: 0,
            totalResets: 0,
            lifetimeProduction: {},
            
            
            // Statistics
            stats: {
                totalClicks: 0,
                totalBuildings: 0,
                gameStartTime: Date.now(),
                lastSaveTime: Date.now(),
                totalPlayTime: 0
            },
            
            // Settings
            settings: {
                autoSave: true,
                showFloatingText: true,
                showNotifications: true,
                soundEnabled: false,
                particleEffects: true
            }
        };
        
        // Initialize buildings from definitions
        initializeBuildings();
        
        // Notify listeners
        notifyListeners('initialize');
        
        return state;
    }
    
    /**
     * Initialize buildings from definitions
     */
    function initializeBuildings() {
        Object.entries(BUILDINGS).forEach(([key, definition]) => {
            state.buildings[key] = {
                count: 0,
                efficiency: 1,
                totalBuilt: 0,
                unlocked: definition.unlocked || false
            };
        });
    }
    
    /**
     * Get the current game state
     * @returns {Object} Current state (read-only)
     */
    function getState() {
        if (!state) {
            initialize();
        }
        // Return a frozen copy to prevent direct mutations
        return Object.freeze(deepClone(state));
    }
    
    /**
     * Update a specific part of the state
     * @param {string} path - Path to update (e.g., 'resources.wood')
     * @param {*} value - New value
     */
    function updateState(path, value) {
        if (!state) return;
        
        const oldValue = getNestedProperty(state, path);
        setNestedProperty(state, path, value);
        
        notifyListeners('update', { path, oldValue, newValue: value });
    }
    
    /**
     * Update multiple state values at once
     * @param {Object} updates - Object with paths and values
     */
    function batchUpdate(updates) {
        if (!state) return;
        
        const changes = [];
        
        Object.entries(updates).forEach(([path, value]) => {
            const oldValue = getNestedProperty(state, path);
            setNestedProperty(state, path, value);
            changes.push({ path, oldValue, newValue: value });
        });
        
        notifyListeners('batchUpdate', { changes });
    }
    
    /**
     * Add resources
     * @param {string} resource - Resource type
     * @param {number} amount - Amount to add
     */
    function addResource(resource, amount) {
        if (!state || !state.resources.hasOwnProperty(resource)) return;
        
        state.resources[resource] = Math.max(0, state.resources[resource] + amount);
        
        // Track lifetime production
        if (amount > 0) {
            if (!state.lifetimeProduction[resource]) {
                state.lifetimeProduction[resource] = 0;
            }
            state.lifetimeProduction[resource] += amount;
        }
        
        notifyListeners('resourceChange', { resource, amount });
    }
    
    /**
     * Add a building
     * @param {string} buildingKey - Building type
     * @returns {boolean} Success
     */
    function addBuilding(buildingKey) {
        if (!state || !state.buildings[buildingKey]) return false;
        
        const building = state.buildings[buildingKey];
        building.count++;
        building.totalBuilt++;
        
        // Update total buildings stat
        state.stats.totalBuildings = Object.values(state.buildings)
            .reduce((sum, b) => sum + b.count, 0);
        
        notifyListeners('buildingAdded', { buildingKey });
        return true;
    }
    
    /**
     * Update building data (for specializations)
     * @param {string} buildingKey - Building type
     * @param {Object} newData - New building data
     * @returns {boolean} Success
     */
    function updateBuilding(buildingKey, newData) {
        if (!state || !state.buildings[buildingKey]) return false;
        
        state.buildings[buildingKey] = { ...state.buildings[buildingKey], ...newData };
        
        // Notify listeners
        notifyListeners('buildingUpdated', { buildingKey, building: state.buildings[buildingKey] });
        
        return true;
    }
    
    /**
     * Purchase an upgrade
     * @param {string} upgradeId - Upgrade ID
     * @returns {boolean} Success
     */
    function purchaseUpgrade(upgradeId) {
        if (!state || state.purchasedUpgrades.includes(upgradeId)) return false;
        
        state.purchasedUpgrades.push(upgradeId);
        notifyListeners('upgradePurchased', { upgradeId });
        return true;
    }
    
    
    /**
     * Perform a research reset
     * @param {number} points - Research points to gain
     */
    function performResearchReset(pointsObj) {
        if (!state) return;
        
        // Save important data
        const keptData = {
            researchPoints: state.researchPoints + pointsObj.researchPoints,
            productionTokens: state.productionTokens + pointsObj.productionTokens,
            innovationPoints: state.innovationPoints + pointsObj.innovationPoints,
            automationCredits: state.automationCredits + pointsObj.automationCredits,
            totalResets: state.totalResets + 1,
            purchasedUpgrades: [...state.purchasedUpgrades],
            lifetimeProduction: { ...state.lifetimeProduction },
            stats: { ...state.stats }
        };
        
        // Reset state
        initialize();
        
        // Restore kept data
        Object.assign(state, keptData);
        
        notifyListeners('researchReset', { points });
    }
    
    /**
     * Save game state to local storage
     */
    function save() {
        if (!state) return;
        
        state.stats.lastSaveTime = Date.now();
        const saveData = JSON.stringify(state);
        
        try {
            localStorage.setItem(STORAGE_KEYS.SAVE_DATA, saveData);
            notifyListeners('save', { success: true });
            return true;
        } catch (e) {
            console.error('Failed to save game:', e);
            notifyListeners('save', { success: false, error: e });
            return false;
        }
    }
    
    /**
     * Load game state from local storage
     */
    function load() {
        try {
            const saveData = localStorage.getItem(STORAGE_KEYS.SAVE_DATA);
            if (!saveData) return false;
            
            const loadedState = JSON.parse(saveData);
            
            // Validate save version
            if (loadedState.version !== GAME_VERSION) {
                console.warn('Save version mismatch, may need migration');
            }
            
            // Merge with default state to handle new properties
            state = deepMerge(initialize(), loadedState);
            
            notifyListeners('load', { success: true });
            return true;
        } catch (e) {
            console.error('Failed to load game:', e);
            notifyListeners('load', { success: false, error: e });
            return false;
        }
    }
    
    /**
     * Reset game to initial state
     */
    function reset() {
        initialize();
        notifyListeners('reset');
    }
    
    /**
     * Add a state change listener
     * @param {Function} callback - Listener function
     */
    function addListener(callback) {
        listeners.add(callback);
    }
    
    /**
     * Remove a state change listener
     * @param {Function} callback - Listener function
     */
    function removeListener(callback) {
        listeners.delete(callback);
    }
    
    /**
     * Notify all listeners of a state change
     * @param {string} type - Change type
     * @param {*} data - Change data
     */
    function notifyListeners(type, data = null) {
        listeners.forEach(callback => {
            try {
                callback(type, data);
            } catch (e) {
                console.error('Listener error:', e);
            }
        });
    }
    
    // Public API
    return {
        initialize,
        getState,
        updateState,
        batchUpdate,
        addResource,
        addBuilding,
        updateBuilding,
        purchaseUpgrade,
        performResearchReset,
        save,
        load,
        reset,
        addListener,
        removeListener
    };
})();