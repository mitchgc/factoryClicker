// =============================================================================
// UPGRADE DEFINITIONS - FACTORY AUTOMATION SYSTEM
// =============================================================================

const UPGRADES = {
    
    // ========== MINING UPGRADES ==========
    
    better_pickaxes: {
        name: 'Better Pickaxes',
        description: 'Iron mines work 50% faster',
        cost: { ironPlates: 100, stone: 50 },
        effect: { buildingMultiplier: { ironMine: 1.5 } },
        category: 'building',
        building: 'ironMine',
        unlockCondition: { buildings: { ironMine: 3 } }
    },
    
    reinforced_mining: {
        name: 'Reinforced Mining Equipment',
        description: 'All mining operations work 25% faster',
        cost: { ironPlates: 300, gears: 50 },
        effect: { 
            buildingMultiplier: { 
                ironMine: 1.25, 
                copperMine: 1.25, 
                coalMine: 1.25, 
                stoneQuarry: 1.25 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { ironMine: 5, copperMine: 2 } }
    },
    
    electric_mining_boost: {
        name: 'Electric Mining Optimization',
        description: 'Electric drills work 75% faster',
        cost: { steel: 100, circuits: 25, electricity: 200 },
        effect: { 
            buildingMultiplier: { 
                electricIronDrill: 1.75, 
                electricCopperDrill: 1.75, 
                electricCoalDrill: 1.75, 
                electricStoneDrill: 1.75 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { electricIronDrill: 2 } }
    },
    
    // ========== SMELTING UPGRADES ==========
    
    improved_furnaces: {
        name: 'Improved Furnaces',
        description: 'Stone and copper furnaces work 50% faster',
        cost: { ironPlates: 200, coal: 100 },
        effect: { 
            buildingMultiplier: { 
                stoneFurnace: 1.5, 
                copperFurnace: 1.5 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { stoneFurnace: 2, copperFurnace: 1 } }
    },
    
    steel_production_mastery: {
        name: 'Steel Production Mastery',
        description: 'Steel furnaces produce 100% more steel',
        cost: { steel: 50, circuits: 15 },
        effect: { buildingMultiplier: { steelFurnace: 2 } },
        category: 'building',
        building: 'steelFurnace',
        unlockCondition: { buildings: { steelFurnace: 3 } }
    },
    
    // ========== MANUFACTURING UPGRADES ==========
    
    gear_production_line: {
        name: 'Gear Production Line',
        description: 'Gear production buildings work 50% faster',
        cost: { gears: 100, ironPlates: 150 },
        effect: { 
            buildingMultiplier: { 
                manualGearPress: 1.5, 
                gearAssembler: 1.5 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { gearAssembler: 2 } }
    },
    
    circuit_assembly_line: {
        name: 'Circuit Assembly Line',
        description: 'Circuit and cable production 75% faster',
        cost: { circuits: 50, copperCables: 200, steel: 100 },
        effect: { 
            buildingMultiplier: { 
                cableAssembler: 1.75, 
                circuitAssembler: 1.75 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { circuitAssembler: 2 } }
    },
    
    // ========== POWER SYSTEM UPGRADES ==========
    
    steam_efficiency: {
        name: 'Steam Engine Efficiency',
        description: 'Steam engines produce 50% more electricity',
        cost: { gears: 75, steel: 50 },
        effect: { buildingMultiplier: { steamEngine: 1.5 } },
        category: 'building',
        building: 'steamEngine',
        unlockCondition: { buildings: { steamEngine: 2 } }
    },
    
    solar_optimization: {
        name: 'Solar Panel Optimization',
        description: 'Solar panels produce 100% more electricity',
        cost: { circuits: 100, steel: 200 },
        effect: { buildingMultiplier: { solarPanel: 2 } },
        category: 'building',
        building: 'solarPanel',
        unlockCondition: { buildings: { solarPanel: 3 } }
    },
    
    // ========== GLOBAL UPGRADES ==========
    
    factory_organization: {
        name: 'Factory Organization',
        description: 'All buildings work 20% faster through better organization',
        cost: { circuits: 100, gears: 200, steel: 100 },
        effect: { globalMultiplier: 1.2 },
        category: 'global',
        unlockCondition: { buildings: { circuitAssembler: 1 } }
    },
    
    industrial_automation: {
        name: 'Industrial Automation',
        description: 'Factory-wide automation increases all production by 50%',
        cost: { circuits: 500, engines: 50, steel: 300 },
        effect: { globalMultiplier: 1.5 },
        category: 'global',
        unlockCondition: { buildings: { engineAssembler: 2 } }
    },
    
    mass_production: {
        name: 'Mass Production',
        description: 'Perfected mass production - all buildings 2x faster',
        cost: { assemblers: 10, circuits: 1000, engines: 100, steel: 500 },
        effect: { globalMultiplier: 2 },
        category: 'global',
        unlockCondition: { buildings: { assemblingMachine: 3 } }
    },
    
    // ========== RESEARCH UPGRADES ==========
    
    research_efficiency: {
        name: 'Research Efficiency',
        description: 'Research points provide 50% more bonus',
        cost: { researchPoints: 10 },
        effect: { researchMultiplier: 1.5 },
        category: 'research',
        unlockCondition: { totalResets: 1 }
    },
    
    advanced_research: {
        name: 'Advanced Research Methods',
        description: 'Research points provide double bonus',
        cost: { researchPoints: 50 },
        effect: { researchMultiplier: 2 },
        category: 'research',
        unlockCondition: { totalResets: 3 }
    },
    
    research_mastery: {
        name: 'Research Mastery',
        description: 'Research bonus multiplied by 3',
        cost: { researchPoints: 200 },
        effect: { researchMultiplier: 3 },
        category: 'research',
        unlockCondition: { totalResets: 8 }
    },
    
    // ========== SPECIALIZED UPGRADES ==========
    
    recycling_efficiency: {
        name: 'Recycling Efficiency',
        description: 'Recycling buildings work 100% faster',
        cost: { circuits: 200, steel: 100 },
        effect: { 
            buildingMultiplier: { 
                scrapRecycler: 2, 
                copperRecycler: 2 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { scrapRecycler: 1 } }
    },
    
    alternative_energy: {
        name: 'Alternative Energy Mastery',
        description: 'Alternative power sources 75% more efficient',
        cost: { steel: 300, circuits: 150 },
        effect: { 
            buildingMultiplier: { 
                coalGasifier: 1.75, 
                windTurbine: 1.75 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { windTurbine: 1 } }
    },
    
    // ========== LATE GAME UPGRADES ==========
    
    robotic_assembly: {
        name: 'Robotic Assembly',
        description: 'Robot-assisted production increases all manufacturing by 100%',
        cost: { robots: 25, computers: 50, circuits: 1000 },
        effect: { 
            buildingMultiplier: { 
                gearAssembler: 2, 
                cableAssembler: 2, 
                circuitAssembler: 2, 
                engineAssembler: 2, 
                assemblingMachine: 2, 
                processingUnit: 2 
            } 
        },
        category: 'building',
        unlockCondition: { buildings: { robotFactory: 2 } }
    },
    
    quantum_efficiency: {
        name: 'Quantum Efficiency',
        description: 'Quantum mechanics applied to production - everything 3x faster',
        cost: { robots: 100, computers: 200, circuits: 5000, steel: 2000 },
        effect: { globalMultiplier: 3 },
        category: 'global',
        unlockCondition: { buildings: { advancedLab: 3 } }
    },
    
    // ========== ELECTRICITY-BASED PRODUCTION UPGRADES ==========
    
    electric_iron_boost: {
        name: 'Electric Iron Production',
        description: 'Electric enhancement for iron production - 50% faster at electricity cost',
        cost: { electricity: 100, circuits: 15, steel: 50 },
        effect: { 
            buildingMultiplier: { 
                ironMine: 1.5, 
                electricIronDrill: 1.5 
            },
            electricityCost: { 
                ironMine: 1, 
                electricIronDrill: 0.5 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { steamEngine: 1 } }
    },
    
    electric_copper_boost: {
        name: 'Electric Copper Production',
        description: 'Electric enhancement for copper production - 50% faster at electricity cost',
        cost: { electricity: 100, circuits: 15, steel: 50 },
        effect: { 
            buildingMultiplier: { 
                copperMine: 1.5, 
                electricCopperDrill: 1.5 
            },
            electricityCost: { 
                copperMine: 1, 
                electricCopperDrill: 0.5 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { steamEngine: 1 } }
    },
    
    electric_coal_boost: {
        name: 'Electric Coal Production',
        description: 'Electric enhancement for coal production - 50% faster at electricity cost',
        cost: { electricity: 100, circuits: 15, steel: 50 },
        effect: { 
            buildingMultiplier: { 
                coalMine: 1.5, 
                electricCoalDrill: 1.5 
            },
            electricityCost: { 
                coalMine: 1, 
                electricCoalDrill: 0.5 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { steamEngine: 1 } }
    },
    
    electric_stone_boost: {
        name: 'Electric Stone Production',
        description: 'Electric enhancement for stone production - 50% faster at electricity cost',
        cost: { electricity: 100, circuits: 15, steel: 50 },
        effect: { 
            buildingMultiplier: { 
                stoneQuarry: 1.5, 
                electricStoneDrill: 1.5 
            },
            electricityCost: { 
                stoneQuarry: 1, 
                electricStoneDrill: 0.5 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { steamEngine: 1 } }
    },
    
    electric_smelting_boost: {
        name: 'Electric Smelting Enhancement',
        description: 'Electric heating for furnaces - 75% faster smelting using electricity',
        cost: { electricity: 200, circuits: 25, steel: 100 },
        effect: { 
            buildingMultiplier: { 
                stoneFurnace: 1.75, 
                copperFurnace: 1.75, 
                steelFurnace: 1.75 
            },
            electricityCost: { 
                stoneFurnace: 2, 
                copperFurnace: 2, 
                steelFurnace: 3 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { steamEngine: 2 } }
    },
    
    electric_manufacturing_boost: {
        name: 'Electric Manufacturing Enhancement',
        description: 'Electric-powered manufacturing - all assembly 100% faster',
        cost: { electricity: 300, circuits: 50, steel: 200 },
        effect: { 
            buildingMultiplier: { 
                manualGearPress: 2, 
                gearAssembler: 2, 
                cableAssembler: 2, 
                circuitAssembler: 2, 
                engineAssembler: 2 
            },
            electricityCost: { 
                manualGearPress: 3, 
                gearAssembler: 1, 
                cableAssembler: 1, 
                circuitAssembler: 2, 
                engineAssembler: 3 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { circuitAssembler: 2 } }
    },
    
    electric_advanced_boost: {
        name: 'Electric Advanced Production',
        description: 'Electric enhancement for advanced production - 150% faster',
        cost: { electricity: 500, circuits: 100, computers: 20 },
        effect: { 
            buildingMultiplier: { 
                assemblingMachine: 2.5, 
                processingUnit: 2.5, 
                robotFactory: 2.5, 
                chemicalPlant: 2.5 
            },
            electricityCost: { 
                assemblingMachine: 4, 
                processingUnit: 5, 
                robotFactory: 8, 
                chemicalPlant: 3 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { assemblingMachine: 1 } }
    },
    
    electric_research_boost: {
        name: 'Electric Research Enhancement',
        description: 'Electric-powered research equipment - research 200% faster',
        cost: { electricity: 400, circuits: 75, computers: 15 },
        effect: { 
            buildingMultiplier: { 
                researchLab: 3, 
                advancedLab: 3 
            },
            electricityCost: { 
                researchLab: 6, 
                advancedLab: 15 
            }
        },
        category: 'electricity',
        unlockCondition: { buildings: { researchLab: 1 } }
    }
};

// Helper functions (same as before)
function getUpgradesByCategory(category) {
    return Object.entries(UPGRADES)
        .filter(([_, upgrade]) => upgrade.category === category)
        .map(([id, upgrade]) => ({ id, ...upgrade }));
}

function getUpgradesForBuilding(buildingKey) {
    return Object.entries(UPGRADES)
        .filter(([_, upgrade]) => upgrade.building === buildingKey)
        .map(([id, upgrade]) => ({ id, ...upgrade }));
}