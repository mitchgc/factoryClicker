// =============================================================================
// GAME CONSTANTS AND CONFIGURATION
// =============================================================================

const GAME_CONFIG = {
    // Development settings
    DEBUG_MODE: true,                    // Enable debug logging

    // Game timing
    UPDATE_INTERVAL: 100,                // Update every 100ms (10 times per second)
    SAVE_INTERVAL: 30000,                // Auto-save every 30 seconds
    
    // Cost scaling
    BUILDING_COST_MULTIPLIER: 1.15,      // Each building costs 15% more
    UPGRADE_COST_MULTIPLIER: 1.5,        // Each upgrade costs 50% more
    UPGRADE_EFFICIENCY_BONUS: 1.25,      // Each upgrade gives 25% efficiency
    
    
    // Workshop bonus
    WORKSHOP_GLOBAL_BONUS: 0.3,          // 30% global production bonus per workshop
    
    
    // Starting resources
    STARTING_IRON_ORE: 50,
    STARTING_STONE: 20,
    
    // Research system (formerly revolution)
    RESEARCH_MULTIPLIER: 0.01,           // 1% bonus per research point
    RESEARCH_RESET_COST_BASE: 1000000,   // Base cost for research reset in total resources
    
    // Number formatting thresholds
    THOUSAND: 1000,
    MILLION: 1000000,
    BILLION: 1000000000,
    TRILLION: 1000000000000,
    QUADRILLION: 1000000000000000,
    QUINTILLION: 1000000000000000000
};

// Resource types and their display properties - Pure Factory System
const RESOURCES = {
    // Raw materials (mined)
    ironOre: {
        name: 'Iron Ore',
        icon: '🟫',
        color: '#8B4513',
        type: 'raw',
        unlocked: true
    },
    copperOre: {
        name: 'Copper Ore',
        icon: '🟠',
        color: '#B87333',
        type: 'raw',
        unlocked: true
    },
    coal: {
        name: 'Coal',
        icon: '⚫',
        color: '#2F4F4F',
        type: 'raw',
        unlocked: true
    },
    stone: {
        name: 'Stone',
        icon: '⬜',
        color: '#C0C0C0',
        type: 'raw',
        unlocked: true
    },
    oil: {
        name: 'Crude Oil',
        icon: '🛢️',
        color: '#000000',
        type: 'raw',
        unlocked: false
    },
    water: {
        name: 'Water',
        icon: '💧',
        color: '#4169E1',
        type: 'raw',
        unlocked: false
    },
    
    // Processed materials (smelted/refined)
    ironPlates: {
        name: 'Iron Plates',
        icon: '🔧',
        color: '#C0C0C0',
        type: 'processed',
        unlocked: false
    },
    copperPlates: {
        name: 'Copper Plates',
        icon: '🔶',
        color: '#CD7F32',
        type: 'processed',
        unlocked: false
    },
    steel: {
        name: 'Steel',
        icon: '⚡',
        color: '#71797E',
        type: 'processed',
        unlocked: false
    },
    plastic: {
        name: 'Plastic',
        icon: '🧪',
        color: '#FF1493',
        type: 'processed',
        unlocked: false
    },
    
    // Intermediate components
    gears: {
        name: 'Iron Gears',
        icon: '⚙️',
        color: '#A9A9A9',
        type: 'component',
        unlocked: false
    },
    copperCables: {
        name: 'Copper Cables',
        icon: '🔌',
        color: '#CD7F32',
        type: 'component',
        unlocked: false
    },
    circuits: {
        name: 'Electronic Circuits',
        icon: '💚',
        color: '#00FF00',
        type: 'component',
        unlocked: false
    },
    engines: {
        name: 'Engines',
        icon: '🏭',
        color: '#FF6347',
        type: 'component',
        unlocked: false
    },
    
    // Advanced products
    assemblers: {
        name: 'Assembling Machines',
        icon: '🏗️',
        color: '#4682B4',
        type: 'advanced',
        unlocked: false
    },
    computers: {
        name: 'Processing Units',
        icon: '💻',
        color: '#1E90FF',
        type: 'advanced',
        unlocked: false
    },
    robots: {
        name: 'Construction Robots',
        icon: '🤖',
        color: '#FFD700',
        type: 'advanced',
        unlocked: false
    },
    
    // Power & utility
    electricity: {
        name: 'Electricity',
        icon: '⚡',
        color: '#FFFF00',
        type: 'power',
        unlocked: false
    },
    
    // Research currencies (multiple prestige types)
    researchPoints: {
        name: 'Research Points',
        icon: '🔬',
        color: '#9932CC',
        type: 'research',
        unlocked: false
    },
    productionTokens: {
        name: 'Production Tokens',
        icon: '🏭',
        color: '#FF4500',
        type: 'research',
        unlocked: false,
        description: 'Earned by maximizing production efficiency'
    },
    innovationPoints: {
        name: 'Innovation Points',
        icon: '💡',
        color: '#FFD700',
        type: 'research',
        unlocked: false,
        description: 'Gained from building diverse factory setups'
    },
    automationCredits: {
        name: 'Automation Credits',
        icon: '🤖',
        color: '#00CED1',
        type: 'research',
        unlocked: false,
        description: 'Awarded for optimizing resource chains'
    }
};

// Game version for save compatibility
const GAME_VERSION = '1.0.0';

// Local storage keys
const STORAGE_KEYS = {
    SAVE_DATA: 'cityProductionTycoon_saveData',
    SETTINGS: 'cityProductionTycoon_settings',
    STATISTICS: 'cityProductionTycoon_statistics'
};