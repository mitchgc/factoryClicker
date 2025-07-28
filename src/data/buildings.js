// =============================================================================
// BUILDING DEFINITIONS
// =============================================================================

const BUILDINGS = {
    // ========== MINING & EXTRACTION ==========
    
    ironMine: {
        name: 'Iron Mine',
        icon: '🟦⛏️',
        description: 'Your first step into industrial automation - extract iron ore manually',
        baseProduction: 2,
        baseCost: { stone: 5 },
        upgradeCost: { ironPlates: 10, stone: 10 },
        produces: { ironOre: 1 },
        consumes: {},
        unlocked: true,
        unlockRequirement: null,
    },
    
    copperMine: {
        name: 'Copper Mine',
        icon: '🟠⛏️',
        description: 'Manual copper ore extraction site',
        baseProduction: 2,
        baseCost: { stone: 5 },
        upgradeCost: { ironPlates: 10, stone: 10 },
        produces: { copperOre: 1 },
        consumes: {},
        unlocked: true,
        unlockRequirement: null
    },
    
    coalMine: {
        name: 'Coal Mine',
        icon: '⚫⛏️',
        description: 'Manual coal extraction site',
        baseProduction: 2,
        baseCost: { stone: 5 },
        upgradeCost: { ironPlates: 10, stone: 10 },
        produces: { coal: 1 },
        consumes: {},
        unlocked: true,
        unlockRequirement: null
    },
    
    stoneQuarry: {
        name: 'Stone Quarry',
        icon: '⬜⛏️',
        description: 'Manual stone extraction site',
        baseProduction: 2,
        baseCost: { ironOre: 10 },
        upgradeCost: { ironPlates: 15 },
        produces: { stone: 1 },
        consumes: {},
        unlocked: true,
        unlockRequirement: null
    },
    
    electricIronDrill: {
        name: 'Electric Iron Drill',
        icon: '🟫⚡',
        description: 'Automated iron ore drilling powered by electricity',
        baseProduction: 5,
        baseCost: { ironPlates: 30, gears: 8 },
        upgradeCost: { ironPlates: 50, circuits: 3 },
        produces: { ironOre: 1 },
        consumes: { electricity: 2 },
        unlocked: false,
        unlockRequirement: { building: 'gearAssembler', count: 1 }
    },
    
    electricCopperDrill: {
        name: 'Electric Copper Drill',
        icon: '🟠⚡',
        description: 'Automated copper ore drilling powered by electricity',
        baseProduction: 5,
        baseCost: { ironPlates: 30, gears: 8 },
        upgradeCost: { copperPlates: 40, circuits: 3 },
        produces: { copperOre: 1 },
        consumes: { electricity: 2 },
        unlocked: false,
        unlockRequirement: { building: 'gearAssembler', count: 1 }
    },
    
    electricCoalDrill: {
        name: 'Electric Coal Drill',
        icon: '⚫⚡',
        description: 'Automated coal drilling powered by electricity',
        baseProduction: 5,
        baseCost: { ironPlates: 30, gears: 8 },
        upgradeCost: { steel: 20, circuits: 3 },
        produces: { coal: 1 },
        consumes: { electricity: 2 },
        unlocked: false,
        unlockRequirement: { building: 'gearAssembler', count: 1 }
    },
    
    electricStoneDrill: {
        name: 'Electric Stone Drill',
        icon: '⬜⚡',
        description: 'Automated stone drilling powered by electricity',
        baseProduction: 5,
        baseCost: { ironPlates: 30, gears: 8 },
        upgradeCost: { steel: 15, circuits: 3 },
        produces: { stone: 1 },
        consumes: { electricity: 2 },
        unlocked: false,
        unlockRequirement: { building: 'gearAssembler', count: 1 }
    },
    
    pumpjack: {
        name: 'Pumpjack',
        icon: '🛢️⚡',
        description: 'Extracts crude oil from underground deposits',
        baseProduction: 1,
        baseCost: { steel: 20, gears: 15, circuits: 10 },
        upgradeCost: { steel: 50, engines: 5 },
        produces: { oil: 1 },
        consumes: { electricity: 4 },
        unlocked: false,
        unlockRequirement: { building: 'engineAssembler', count: 1 }
    },
    
    waterPump: {
        name: 'Manual Water Pump',
        icon: '💧💪',
        description: 'Hand-operated pump that extracts water',
        baseProduction: 5,
        baseCost: { ironPlates: 10, gears: 5 },
        upgradeCost: { ironPlates: 20, gears: 10 },
        produces: { water: 1 },
        consumes: {},
        unlocked: false,
        unlockRequirement: { building: 'manualGearPress', count: 1 }
    },

    // ========== SMELTING & PROCESSING ==========
    
    stoneFurnace: {
        name: 'Stone Furnace',
        icon: '🔥🔧',
        description: 'Transform raw ore into useful plates - the foundation of all manufacturing',
        baseProduction: 2,
        baseCost: { ironOre: 20 },
        upgradeCost: { ironPlates: 15 },
        produces: { ironPlates: 1 },
        consumes: { ironOre: 1, coal: 0.25 },
        unlocked: false,
        unlockRequirement: { building: 'ironMine', count: 2 },
    },
    
    copperFurnace: {
        name: 'Copper Furnace',
        icon: '🔥🟦',
        description: 'Smelts copper ore into copper plates (1:1 ratio)',
        baseProduction: 2,
        baseCost: { ironOre: 15, stone: 10 },
        upgradeCost: { ironPlates: 10, copperPlates: 5 },
        produces: { copperPlates: 1 },
        consumes: { copperOre: 1, coal: 0.25 },
        unlocked: false,
        unlockRequirement: { building: 'copperMine', count: 1 }
    },
    
    steelFurnace: {
        name: 'Steel Furnace',
        icon: '⚡🔥',
        description: 'Produces steel from iron plates (5:1 ratio)',
        baseProduction: 1,
        baseCost: { ironPlates: 30, stone: 20 },
        upgradeCost: { ironPlates: 50, coal: 20 },
        produces: { steel: 1 },
        consumes: { ironPlates: 5, coal: 1 },
        unlocked: false,
        unlockRequirement: { building: 'circuitAssembler', count: 1 }
    },
    
    chemicalPlant: {
        name: 'Chemical Plant',
        icon: '🧪⚡',
        description: 'Processes oil into plastic and other chemicals',
        baseProduction: 1,
        baseCost: { steel: 15, gears: 10, circuits: 5 },
        upgradeCost: { steel: 30, engines: 5 },
        produces: { plastic: 1 },
        consumes: { oil: 3, water: 1, electricity: 3 },
        unlocked: false,
        unlockRequirement: { building: 'pumpjack', count: 1 }
    },

    // ========== POWER GENERATION ==========
    
    steamEngine: {
        name: 'Steam Engine',
        icon: '⚡🔥',
        description: 'Burns coal to generate electricity via steam',
        baseProduction: 10,
        baseCost: { ironPlates: 30, gears: 15, stone: 10 },
        upgradeCost: { steel: 20, gears: 30 },
        produces: { electricity: 1 },
        consumes: { coal: 1, water: 2 },
        unlocked: false,
        unlockRequirement: { building: 'waterPump', count: 1 }
    },
    
    solarPanel: {
        name: 'Solar Panel',
        icon: '☀️⚡',
        description: 'Generates clean electricity from sunlight',
        baseProduction: 2,
        baseCost: { steel: 15, circuits: 10, copperPlates: 20 },
        upgradeCost: { circuits: 20, steel: 30 },
        produces: { electricity: 1 },
        consumes: {},
        unlocked: false,
        unlockRequirement: { building: 'researchLab', count: 1 }
    },

    // ========== MANUFACTURING ==========
    
    manualGearPress: {
        name: 'Manual Gear Press',
        icon: '⚙️💪',
        description: 'Hand-cranked press that makes gears from iron plates',
        baseProduction: 1,
        baseCost: { ironPlates: 15, stone: 5 },
        upgradeCost: { ironPlates: 20, gears: 5 },
        produces: { gears: 1 },
        consumes: { ironPlates: 2 },
        unlocked: false,
        unlockRequirement: { building: 'stoneFurnace', count: 1 }
    },
    
    gearAssembler: {
        name: 'Gear Assembly Machine',
        icon: '⚙️⚡',
        description: 'Automated gear production powered by electricity',
        baseProduction: 3,
        baseCost: { ironPlates: 25, gears: 10 },
        upgradeCost: { gears: 20, circuits: 5 },
        produces: { gears: 1 },
        consumes: { ironPlates: 2, electricity: 1 },
        unlocked: false,
        unlockRequirement: { building: 'steamEngine', count: 1 },
    },
    
    cableAssembler: {
        name: 'Cable Assembly Machine',
        icon: '🔌⚡',
        description: 'Produces copper cables from copper plates (2:1 ratio)',
        baseProduction: 2,
        baseCost: { ironPlates: 20, gears: 8 },
        upgradeCost: { gears: 15, copperPlates: 30 },
        produces: { copperCables: 2 },
        consumes: { copperPlates: 1, electricity: 1 },
        unlocked: false,
        unlockRequirement: { building: 'gearAssembler', count: 1 }
    },
    
    circuitAssembler: {
        name: 'Circuit Assembly Machine',
        icon: '📚⚡',
        description: 'Manufactures electronic circuits (1 iron plate + 3 cables = 1 circuit)',
        baseProduction: 1,
        baseCost: { ironPlates: 40, gears: 15, copperCables: 20 },
        upgradeCost: { circuits: 10, gears: 25 },
        produces: { circuits: 1 },
        consumes: { ironPlates: 1, copperCables: 3, electricity: 2 },
        unlocked: false,
        unlockRequirement: { building: 'cableAssembler', count: 1 }
    },
    
    engineAssembler: {
        name: 'Engine Assembly Machine',
        icon: '🏧⚡',
        description: 'Builds engines from steel and gears (1 steel + 1 gear = 1 engine)',
        baseProduction: 0.5,
        baseCost: { steel: 30, gears: 20, circuits: 10 },
        upgradeCost: { steel: 50, gears: 30 },
        produces: { engines: 1 },
        consumes: { steel: 1, gears: 1, electricity: 3 },
        unlocked: false,
        unlockRequirement: { building: 'steelFurnace', count: 1 }
    },

    // ========== ADVANCED MANUFACTURING ==========
    
    assemblingMachine: {
        name: 'Assembling Machine Mk1',
        icon: '🏧🤖',
        description: 'Automated assembler for complex products',
        baseProduction: 1,
        baseCost: { ironPlates: 50, gears: 30, circuits: 15 },
        upgradeCost: { assemblers: 3, circuits: 25 },
        produces: { assemblers: 1 },
        consumes: { ironPlates: 10, gears: 5, circuits: 3, electricity: 4 },
        unlocked: false,
        unlockRequirement: { building: 'engineAssembler', count: 2 }
    },

    // ========== ALTERNATIVE PRODUCTION ROUTES ==========
    
    scrapRecycler: {
        name: 'Scrap Recycler',
        icon: '♾️⚡',
        description: 'Converts excess items back into basic materials',
        baseProduction: 2,
        baseCost: { ironPlates: 30, gears: 15, circuits: 5 },
        upgradeCost: { circuits: 10, steel: 20 },
        produces: { ironPlates: 1 },
        consumes: { gears: 2, electricity: 2 },
        unlocked: false,
        unlockRequirement: { building: 'circuitAssembler', count: 1 },
        isAlternative: true
    },
    
    copperRecycler: {
        name: 'Copper Recycler',
        icon: '🔌♾️',
        description: 'Recycles copper components back into plates',
        baseProduction: 2,
        baseCost: { copperPlates: 25, gears: 10 },
        upgradeCost: { circuits: 8, copperPlates: 30 },
        produces: { copperPlates: 1 },
        consumes: { copperCables: 3, electricity: 1 },
        unlocked: false,
        unlockRequirement: { building: 'cableAssembler', count: 1 },
        isAlternative: true
    },
    
    coalGasifier: {
        name: 'Coal Gasifier',
        icon: '⚫⚡',
        description: 'Alternative energy: converts coal directly to electricity',
        baseProduction: 8,
        baseCost: { steel: 20, gears: 15 },
        upgradeCost: { steel: 40, circuits: 10 },
        produces: { electricity: 1 },
        consumes: { coal: 2 },
        unlocked: false,
        unlockRequirement: { building: 'steamEngine', count: 1 },
        isAlternative: true
    },
    
    windTurbine: {
        name: 'Wind Turbine',
        icon: '🌬️⚡',
        description: 'Clean energy alternative - no fuel required',
        baseProduction: 3,
        baseCost: { steel: 40, gears: 25, circuits: 8 },
        upgradeCost: { steel: 60, circuits: 15 },
        produces: { electricity: 1 },
        consumes: {},
        unlocked: false,
        unlockRequirement: { building: 'solarPanel', count: 1 },
        isAlternative: true
    },
    
    processingUnit: {
        name: 'Processing Unit Factory',
        icon: '💻⚡',
        description: 'Manufactures advanced processing units',
        baseProduction: 0.5,
        baseCost: { circuits: 50, plastic: 30, engines: 10 },
        upgradeCost: { computers: 5, circuits: 100 },
        produces: { computers: 1 },
        consumes: { circuits: 20, plastic: 2, electricity: 5 },
        unlocked: false,
        unlockRequirement: { building: 'chemicalPlant', count: 2 }
    },
    
    robotFactory: {
        name: 'Robot Assembly Facility',
        icon: '🤖🏧',
        description: 'Builds construction robots for automation',
        baseProduction: 0.3,
        baseCost: { engines: 15, computers: 10, circuits: 30 },
        upgradeCost: { robots: 3, computers: 20 },
        produces: { robots: 1 },
        consumes: { engines: 1, computers: 1, circuits: 5, electricity: 8 },
        unlocked: false,
        unlockRequirement: { building: 'processingUnit', count: 1 }
    },

    // ========== RESEARCH ==========
    
    researchLab: {
        name: 'Research Laboratory',
        icon: '🔬⚡',
        description: 'Conducts research to unlock new technologies',
        baseProduction: 1,
        baseCost: { ironPlates: 50, circuits: 30, gears: 25 },
        upgradeCost: { circuits: 50, steel: 20 },
        produces: { researchPoints: 1 },
        consumes: { circuits: 2, electricity: 6 },
        unlocked: false,
        unlockRequirement: { building: 'circuitAssembler', count: 2 }
    },
    
    advancedLab: {
        name: 'Advanced Research Lab',
        icon: '🔬🤖',
        description: 'High-tech research facility for cutting-edge technologies',
        baseProduction: 3,
        baseCost: { steel: 100, computers: 20, engines: 15 },
        upgradeCost: { robots: 5, computers: 50 },
        produces: { researchPoints: 1 },
        consumes: { computers: 1, circuits: 5, electricity: 15 },
        unlocked: false,
        unlockRequirement: { building: 'processingUnit', count: 2 }
    }
};

// Helper function to get building tier (for UI organization)
function getBuildingTier(buildingKey) {
    const tiers = {
        1: ['ironMine', 'copperMine', 'coalMine', 'stoneQuarry'],
        2: ['stoneFurnace', 'copperFurnace'],
        3: ['manualGearPress'],
        4: ['waterPump'],
        5: ['steamEngine', 'coalGasifier'],
        6: ['gearAssembler', 'cableAssembler', 'scrapRecycler', 'copperRecycler'],
        7: ['electricIronDrill', 'electricCopperDrill', 'electricCoalDrill', 'electricStoneDrill', 'circuitAssembler'],
        8: ['steelFurnace', 'researchLab'],
        9: ['engineAssembler', 'solarPanel', 'windTurbine'],
        10: ['pumpjack', 'assemblingMachine'],
        11: ['chemicalPlant', 'processingUnit'],
        12: ['robotFactory', 'advancedLab']
    };
    
    for (const [tier, buildings] of Object.entries(tiers)) {
        if (buildings.includes(buildingKey)) {
            return parseInt(tier);
        }
    }
    return 0;
}