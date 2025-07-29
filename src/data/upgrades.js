// =============================================================================
// UPGRADE DEFINITIONS - IDLE FACTORY PROGRESSION SYSTEM
// =============================================================================

const UPGRADES = {
    // =============================================================================
    // TIER 1: EARLY MINING BUILDINGS (Basic Manual → Mechanical → Electric)
    // =============================================================================
    
    // ========== IRON MINE UPGRADES ==========
    iron_mine_upgrade_1: {
        name: 'Steel Pickaxes',
        description: 'Replace iron tools with hardened steel - doubles mining speed',
        cost: { ironPlates: 40, stone: 20 },
        effect: { buildingMultiplier: { ironMine: 2 } },
        category: 'building',
        building: 'ironMine',
        unlockCondition: { buildings: { ironMine: 2 } }
    },
    
    iron_mine_upgrade_2: {
        name: 'Pneumatic Drills',
        description: 'Steam-powered drilling equipment - triples total mining efficiency',
        cost: { ironPlates: 200, gears: 50, coal: 100 },
        effect: { buildingMultiplier: { ironMine: 3 } },
        category: 'building',
        building: 'ironMine',
        unlockCondition: { upgrades: ['iron_mine_upgrade_1'] }
    },
    
    iron_mine_upgrade_electric: {
        name: 'Electric Mining Complex',
        description: 'Fully automated electric mining - 5x efficiency revolution',
        cost: { electricity: 200, circuits: 25, steel: 100 },
        effect: { buildingMultiplier: { ironMine: 5 } },
        category: 'electricity',
        building: 'ironMine',
        unlockCondition: { upgrades: ['iron_mine_upgrade_2'], buildings: { steamEngine: 1 } }
    },
    
    // ========== COPPER MINE UPGRADES ==========
    copper_mine_upgrade_1: {
        name: 'Reinforced Tools',
        description: 'Stronger mining equipment for copper extraction - doubles output',
        cost: { ironPlates: 40, copperPlates: 20 },
        effect: { buildingMultiplier: { copperMine: 2 } },
        category: 'building',
        building: 'copperMine',
        unlockCondition: { buildings: { copperMine: 2 } }
    },
    
    copper_mine_upgrade_2: {
        name: 'Hydraulic Excavators',
        description: 'Water-powered extraction systems - triples mining capacity',
        cost: { copperPlates: 150, gears: 40, water: 200 },
        effect: { buildingMultiplier: { copperMine: 3 } },
        category: 'building',
        building: 'copperMine',
        unlockCondition: { upgrades: ['copper_mine_upgrade_1'] }
    },
    
    copper_mine_upgrade_electric: {
        name: 'Electric Copper Complex',
        description: 'Computer-controlled extraction - 5x efficiency breakthrough',
        cost: { electricity: 200, circuits: 25, steel: 100 },
        effect: { buildingMultiplier: { copperMine: 5 } },
        category: 'electricity',
        building: 'copperMine',
        unlockCondition: { upgrades: ['copper_mine_upgrade_2'], buildings: { steamEngine: 1 } }
    },
    
    // ========== COAL MINE UPGRADES ==========
    coal_mine_upgrade_1: {
        name: 'Deep Shaft Mining',
        description: 'Access deeper coal seams - doubles extraction rate',
        cost: { ironPlates: 50, stone: 40 },
        effect: { buildingMultiplier: { coalMine: 2 } },
        category: 'building',
        building: 'coalMine',
        unlockCondition: { buildings: { coalMine: 2 } }
    },
    
    coal_mine_upgrade_2: {
        name: 'Steam Ventilation',
        description: 'Steam-powered air circulation enables deeper mining - triples output',
        cost: { ironPlates: 200, gears: 40, coal: 50 },
        effect: { buildingMultiplier: { coalMine: 3 } },
        category: 'building',
        building: 'coalMine',
        unlockCondition: { upgrades: ['coal_mine_upgrade_1'] }
    },
    
    coal_mine_upgrade_electric: {
        name: 'Electric Mining Operation',
        description: 'Electric conveyor systems and automated extraction - 5x efficiency',
        cost: { electricity: 200, circuits: 20, steel: 80 },
        effect: { buildingMultiplier: { coalMine: 5 } },
        category: 'electricity',
        building: 'coalMine',
        unlockCondition: { upgrades: ['coal_mine_upgrade_2'], buildings: { steamEngine: 1 } }
    },
    
    // ========== STONE QUARRY UPGRADES ==========
    stone_quarry_upgrade_1: {
        name: 'Explosive Charges',
        description: 'Controlled blasting for faster stone extraction - doubles output',
        cost: { ironPlates: 60, coal: 30 },
        effect: { buildingMultiplier: { stoneQuarry: 2 } },
        category: 'building',
        building: 'stoneQuarry',
        unlockCondition: { buildings: { stoneQuarry: 2 } }
    },
    
    stone_quarry_upgrade_2: {
        name: 'Steam Crushers',
        description: 'Steam-powered stone crushing and sorting - triples efficiency',
        cost: { ironPlates: 200, gears: 50, coal: 100 },
        effect: { buildingMultiplier: { stoneQuarry: 3 } },
        category: 'building',
        building: 'stoneQuarry',
        unlockCondition: { upgrades: ['stone_quarry_upgrade_1'] }
    },
    
    stone_quarry_upgrade_electric: {
        name: 'Electric Quarry Complex',
        description: 'Electric drilling and automated sorting - 5x stone production',
        cost: { electricity: 180, circuits: 20, steel: 90 },
        effect: { buildingMultiplier: { stoneQuarry: 5 } },
        category: 'electricity',
        building: 'stoneQuarry',
        unlockCondition: { upgrades: ['stone_quarry_upgrade_2'], buildings: { steamEngine: 1 } }
    },
    
    // =============================================================================
    // TIER 2: SMELTING BUILDINGS (Manual → Mechanical → Electric)
    // =============================================================================
    
    // ========== STONE FURNACE UPGRADES ==========
    stone_furnace_upgrade_1: {
        name: 'Draft Bellows',
        description: 'Improved airflow increases smelting temperature - doubles efficiency',
        cost: { ironPlates: 80, coal: 50 },
        effect: { buildingMultiplier: { stoneFurnace: 2 } },
        category: 'building',
        building: 'stoneFurnace',
        unlockCondition: { buildings: { stoneFurnace: 2 } }
    },
    
    stone_furnace_upgrade_2: {
        name: 'Firebrick Lining',
        description: 'Advanced refractory materials retain heat better - triples output',
        cost: { ironPlates: 300, stone: 200, coal: 150 },
        effect: { buildingMultiplier: { stoneFurnace: 3 } },
        category: 'building',
        building: 'stoneFurnace',
        unlockCondition: { upgrades: ['stone_furnace_upgrade_1'] }
    },
    
    stone_furnace_upgrade_electric: {
        name: 'Electric Arc Furnace',
        description: 'Electric heating replaces coal burning - 5x smelting revolution',
        cost: { electricity: 300, circuits: 30, steel: 150 },
        effect: { buildingMultiplier: { stoneFurnace: 5 } },
        category: 'electricity',
        building: 'stoneFurnace',
        unlockCondition: { upgrades: ['stone_furnace_upgrade_2'], buildings: { steamEngine: 1 } }
    },
    
    // ========== COPPER FURNACE UPGRADES ==========
    copper_furnace_upgrade_1: {
        name: 'Copper Crucibles',
        description: 'Specialized copper smelting equipment - doubles processing speed',
        cost: { copperPlates: 60, ironPlates: 40, coal: 40 },
        effect: { buildingMultiplier: { copperFurnace: 2 } },
        category: 'building',
        building: 'copperFurnace',
        unlockCondition: { buildings: { copperFurnace: 2 } }
    },
    
    copper_furnace_upgrade_2: {
        name: 'Multi-Chamber Design',
        description: 'Process multiple batches simultaneously - triples capacity',
        cost: { copperPlates: 200, ironPlates: 150, gears: 30 },
        effect: { buildingMultiplier: { copperFurnace: 3 } },
        category: 'building',
        building: 'copperFurnace',
        unlockCondition: { upgrades: ['copper_furnace_upgrade_1'] }
    },
    
    copper_furnace_upgrade_electric: {
        name: 'Electric Copper Refinery',
        description: 'Precise electric temperature control - 5x purification efficiency',
        cost: { electricity: 250, circuits: 25, steel: 120 },
        effect: { buildingMultiplier: { copperFurnace: 5 } },
        category: 'electricity',
        building: 'copperFurnace',
        unlockCondition: { upgrades: ['copper_furnace_upgrade_2'], buildings: { steamEngine: 1 } }
    },
    
    // ========== STEEL FURNACE UPGRADES ==========
    steel_furnace_upgrade_1: {
        name: 'Carbon Injection',
        description: 'Optimized carbon content for superior steel - doubles quality',
        cost: { steel: 100, coal: 200, ironPlates: 150 },
        effect: { buildingMultiplier: { steelFurnace: 2 } },
        category: 'building',
        building: 'steelFurnace',
        unlockCondition: { buildings: { steelFurnace: 2 } }
    },
    
    steel_furnace_upgrade_2: {
        name: 'Blast Furnace Design',
        description: 'High-temperature steel production techniques - triples output',
        cost: { steel: 400, gears: 80, circuits: 20 },
        effect: { buildingMultiplier: { steelFurnace: 3 } },
        category: 'building',
        building: 'steelFurnace',
        unlockCondition: { upgrades: ['steel_furnace_upgrade_1'] }
    },
    
    steel_furnace_upgrade_electric: {
        name: 'Electric Steel Mill',
        description: 'Computer-controlled steel production - 5x precision manufacturing',
        cost: { electricity: 400, circuits: 50, computers: 10 },
        effect: { buildingMultiplier: { steelFurnace: 5 } },
        category: 'electricity',
        building: 'steelFurnace',
        unlockCondition: { upgrades: ['steel_furnace_upgrade_2'], buildings: { circuitAssembler: 1 } }
    },
    
    // =============================================================================
    // TIER 3: MANUFACTURING BUILDINGS (Manual → Assembly Line → Electric)
    // =============================================================================
    
    // ========== MANUAL GEAR PRESS UPGRADES ==========
    manual_gear_press_upgrade_1: {
        name: 'Precision Tooling',
        description: 'Accurate cutting tools for better gears - doubles production rate',
        cost: { ironPlates: 100, gears: 20 },
        effect: { buildingMultiplier: { manualGearPress: 2 } },
        category: 'building',
        building: 'manualGearPress',
        unlockCondition: { buildings: { manualGearPress: 2 } }
    },
    
    manual_gear_press_upgrade_2: {
        name: 'Assembly Jigs',
        description: 'Mechanical templates for consistent gear production - triples efficiency',
        cost: { ironPlates: 300, gears: 100, steel: 50 },
        effect: { buildingMultiplier: { manualGearPress: 3 } },
        category: 'building',
        building: 'manualGearPress',  
        unlockCondition: { upgrades: ['manual_gear_press_upgrade_1'] }
    },
    
    manual_gear_press_upgrade_electric: {
        name: 'Electric Gear Factory',
        description: 'Automated electric gear manufacturing - 5x production revolution',
        cost: { electricity: 300, circuits: 40, steel: 200 },
        effect: { buildingMultiplier: { manualGearPress: 5 } },
        category: 'electricity',
        building: 'manualGearPress',
        unlockCondition: { upgrades: ['manual_gear_press_upgrade_2'], buildings: { gearAssembler: 1 } }
    },
    
    // ========== GEAR ASSEMBLER UPGRADES ==========
    gear_assembler_upgrade_1: {
        name: 'Multi-Tool Setup',
        description: 'Multiple cutting tools work simultaneously - doubles throughput',
        cost: { gears: 80, ironPlates: 150, circuits: 10 },
        effect: { buildingMultiplier: { gearAssembler: 2 } },
        category: 'building',
        building: 'gearAssembler',
        unlockCondition: { buildings: { gearAssembler: 2 } }
    },
    
    gear_assembler_upgrade_2: {
        name: 'Batch Processing',
        description: 'Process multiple gears in each cycle - triples production capacity',
        cost: { gears: 300, steel: 100, circuits: 30 },
        effect: { buildingMultiplier: { gearAssembler: 3 } },
        category: 'building',
        building: 'gearAssembler',
        unlockCondition: { upgrades: ['gear_assembler_upgrade_1'] }
    },
    
    gear_assembler_upgrade_electric: {
        name: 'Robotic Gear Assembly',
        description: 'Computer-controlled robotic precision - 5x manufacturing efficiency',
        cost: { electricity: 400, circuits: 60, computers: 15 },
        effect: { buildingMultiplier: { gearAssembler: 5 } },
        category: 'electricity',
        building: 'gearAssembler',
        unlockCondition: { upgrades: ['gear_assembler_upgrade_2'], buildings: { circuitAssembler: 1 } }
    },
    
    // ========== CABLE ASSEMBLER UPGRADES ==========
    cable_assembler_upgrade_1: {
        name: 'Wire Drawing Dies',
        description: 'Precise copper wire forming - doubles cable production',
        cost: { copperPlates: 120, gears: 40, ironPlates: 80 },
        effect: { buildingMultiplier: { cableAssembler: 2 } },
        category: 'building',
        building: 'cableAssembler',
        unlockCondition: { buildings: { cableAssembler: 2 } }
    },
    
    cable_assembler_upgrade_2: {
        name: 'Insulation Coating',
        description: 'Advanced cable insulation process - triples output quality',
        cost: { copperPlates: 400, gears: 150, circuits: 25 },
        effect: { buildingMultiplier: { cableAssembler: 3 } },
        category: 'building',
        building: 'cableAssembler',
        unlockCondition: { upgrades: ['cable_assembler_upgrade_1'] }
    },
    
    cable_assembler_upgrade_electric: {
        name: 'Electric Wire Factory',
        description: 'Automated wire drawing and coating - 5x cable manufacturing',
        cost: { electricity: 350, circuits: 50, steel: 180 },
        effect: { buildingMultiplier: { cableAssembler: 5 } },
        category: 'electricity',
        building: 'cableAssembler',
        unlockCondition: { upgrades: ['cable_assembler_upgrade_2'], buildings: { circuitAssembler: 1 } }
    },
    
    // ========== CIRCUIT ASSEMBLER UPGRADES ==========
    circuit_assembler_upgrade_1: {
        name: 'Soldering Stations',
        description: 'Dedicated soldering equipment - doubles circuit assembly speed',
        cost: { circuits: 50, copperCables: 200, steel: 100 },
        effect: { buildingMultiplier: { circuitAssembler: 2 } },
        category: 'building',
        building: 'circuitAssembler',
        unlockCondition: { buildings: { circuitAssembler: 2 } }
    },
    
    circuit_assembler_upgrade_2: {
        name: 'Component Placement',
        description: 'Mechanical component placement system - triples production rate',
        cost: { circuits: 200, steel: 300, gears: 100 },
        effect: { buildingMultiplier: { circuitAssembler: 3 } },
        category: 'building',
        building: 'circuitAssembler',
        unlockCondition: { upgrades: ['circuit_assembler_upgrade_1'] }
    },
    
    circuit_assembler_upgrade_electric: {
        name: 'Electronic Assembly Line',
        description: 'Fully automated electronic assembly - 5x circuit manufacturing',
        cost: { electricity: 500, circuits: 100, computers: 20 },
        effect: { buildingMultiplier: { circuitAssembler: 5 } },
        category: 'electricity',
        building: 'circuitAssembler',
        unlockCondition: { upgrades: ['circuit_assembler_upgrade_2'], buildings: { processingUnit: 1 } }
    },
    
    // =============================================================================
    // TIER 4: POWER GENERATION (Steam → Efficiency → Electric Management)
    // =============================================================================
    
    // ========== STEAM ENGINE UPGRADES ==========
    steam_engine_upgrade_1: {
        name: 'High-Pressure Boiler',
        description: 'Increased steam pressure - doubles power generation',
        cost: { steel: 150, gears: 80, water: 500 },
        effect: { buildingMultiplier: { steamEngine: 2 } },
        category: 'building',
        building: 'steamEngine',
        unlockCondition: { buildings: { steamEngine: 2 } }
    },
    
    steam_engine_upgrade_2: {
        name: 'Condensing System',
        description: 'Water recycling and steam optimization - triples efficiency',
        cost: { steel: 400, gears: 200, circuits: 30 },
        effect: { buildingMultiplier: { steamEngine: 3 } },
        category: 'building',
        building: 'steamEngine',
        unlockCondition: { upgrades: ['steam_engine_upgrade_1'] }
    },
    
    steam_engine_upgrade_electric: {
        name: 'Turbine Generator Complex',
        description: 'Advanced electric turbine system - 5x power generation',
        cost: { electricity: 600, circuits: 80, computers: 25 },
        effect: { buildingMultiplier: { steamEngine: 5 } },
        category: 'electricity',
        building: 'steamEngine',
        unlockCondition: { upgrades: ['steam_engine_upgrade_2'], buildings: { circuitAssembler: 1 } }
    },
    
    // ========== SOLAR PANEL UPGRADES ==========
    solar_panel_upgrade_1: {
        name: 'Concentrated Arrays',
        description: 'Focused solar collection - doubles energy capture',
        cost: { circuits: 80, steel: 200, copperCables: 300 },
        effect: { buildingMultiplier: { solarPanel: 2 } },
        category: 'building',
        building: 'solarPanel',
        unlockCondition: { buildings: { solarPanel: 2 } }
    },
    
    solar_panel_upgrade_2: {
        name: 'Tracking Systems',
        description: 'Panels follow the sun automatically - triples efficiency',
        cost: { circuits: 300, steel: 500, gears: 150 },
        effect: { buildingMultiplier: { solarPanel: 3 } },
        category: 'building',
        building: 'solarPanel',
        unlockCondition: { upgrades: ['solar_panel_upgrade_1'] }
    },
    
    solar_panel_upgrade_electric: {
        name: 'Smart Solar Farm',
        description: 'Computer-optimized solar energy management - 5x power output',
        cost: { electricity: 400, circuits: 120, computers: 30 },
        effect: { buildingMultiplier: { solarPanel: 5 } },
        category: 'electricity',
        building: 'solarPanel',
        unlockCondition: { upgrades: ['solar_panel_upgrade_2'], buildings: { processingUnit: 1 } }
    },
    
    // =============================================================================
    // TIER 5: ADVANCED MANUFACTURING (Prototype → Refined → Computerized)
    // =============================================================================
    
    // ========== ENGINE ASSEMBLER UPGRADES ==========
    engine_assembler_upgrade_1: {
        name: 'Precision Machining',
        description: 'High-precision engine components - doubles assembly quality',
        cost: { engines: 25, steel: 300, gears: 150 },
        effect: { buildingMultiplier: { engineAssembler: 2 } },
        category: 'building',
        building: 'engineAssembler',
        unlockCondition: { buildings: { engineAssembler: 2 } }
    },
    
    engine_assembler_upgrade_2: {
        name: 'Assembly Line Production',
        description: 'Streamlined engine manufacturing process - triples throughput',
        cost: { engines: 100, steel: 800, circuits: 50 },
        effect: { buildingMultiplier: { engineAssembler: 3 } },
        category: 'building',
        building: 'engineAssembler',
        unlockCondition: { upgrades: ['engine_assembler_upgrade_1'] }
    },
    
    engine_assembler_upgrade_electric: {
        name: 'Robotic Engine Factory',
        description: 'Fully automated robotic engine assembly - 5x manufacturing capacity',
        cost: { electricity: 800, circuits: 150, computers: 40 },
        effect: { buildingMultiplier: { engineAssembler: 5 } },
        category: 'electricity',
        building: 'engineAssembler',
        unlockCondition: { upgrades: ['engine_assembler_upgrade_2'], buildings: { robotFactory: 1 } }
    },
    
    // ========== ASSEMBLING MACHINE UPGRADES ==========
    assembling_machine_upgrade_1: {
        name: 'Modular Design',
        description: 'Interchangeable assembly modules - doubles production flexibility',
        cost: { assemblers: 15, circuits: 100, steel: 400 },
        effect: { buildingMultiplier: { assemblingMachine: 2 } },
        category: 'building',
        building: 'assemblingMachine',
        unlockCondition: { buildings: { assemblingMachine: 2 } }
    },
    
    assembling_machine_upgrade_2: {
        name: 'Quality Control Systems',
        description: 'Automated quality assurance - triples output reliability',
        cost: { assemblers: 60, circuits: 400, engines: 50 },
        effect: { buildingMultiplier: { assemblingMachine: 3 } },
        category: 'building',
        building: 'assemblingMachine',
        unlockCondition: { upgrades: ['assembling_machine_upgrade_1'] }
    },
    
    assembling_machine_upgrade_electric: {
        name: 'AI-Controlled Assembly',
        description: 'Artificial intelligence optimizes all assembly processes - 5x efficiency',
        cost: { electricity: 1000, circuits: 200, computers: 60 },
        effect: { buildingMultiplier: { assemblingMachine: 5 } },
        category: 'electricity',
        building: 'assemblingMachine',
        unlockCondition: { upgrades: ['assembling_machine_upgrade_2'], buildings: { robotFactory: 1 } }
    },
    
    // =============================================================================
    // TIER 6: RESEARCH & DEVELOPMENT (Basic → Advanced → Supercomputing)
    // =============================================================================
    
    // ========== RESEARCH LAB UPGRADES ==========
    research_lab_upgrade_1: {
        name: 'Advanced Instruments',
        description: 'Precision scientific equipment - doubles research speed',
        cost: { circuits: 200, steel: 300, computers: 20 },
        effect: { buildingMultiplier: { researchLab: 2 } },
        category: 'building',
        building: 'researchLab',
        unlockCondition: { buildings: { researchLab: 2 } }
    },
    
    research_lab_upgrade_2: {
        name: 'Research Teams',
        description: 'Collaborative research methodology - triples discovery rate',
        cost: { circuits: 600, computers: 80, engines: 40 },
        effect: { buildingMultiplier: { researchLab: 3 } },
        category: 'building',
        building: 'researchLab',
        unlockCondition: { upgrades: ['research_lab_upgrade_1'] }
    },
    
    research_lab_upgrade_electric: {
        name: 'Supercomputer Research',
        description: 'Computer simulation accelerates all research - 5x scientific progress',
        cost: { electricity: 1200, circuits: 300, computers: 100 },
        effect: { buildingMultiplier: { researchLab: 5 } },
        category: 'electricity',
        building: 'researchLab',
        unlockCondition: { upgrades: ['research_lab_upgrade_2'], buildings: { advancedLab: 1 } }
    },
    
    // ========== ADVANCED LAB UPGRADES ==========
    advanced_lab_upgrade_1: {
        name: 'Quantum Instruments',
        description: 'Cutting-edge quantum research tools - doubles breakthrough potential',
        cost: { computers: 100, circuits: 500, robots: 20 },
        effect: { buildingMultiplier: { advancedLab: 2 } },
        category: 'building',
        building: 'advancedLab',
        unlockCondition: { buildings: { advancedLab: 2 } }
    },
    
    advanced_lab_upgrade_2: {
        name: 'Parallel Processing',
        description: 'Multiple research streams simultaneously - triples research capacity',
        cost: { computers: 400, robots: 80, circuits: 1000 },
        effect: { buildingMultiplier: { advancedLab: 3 } },
        category: 'building',
        building: 'advancedLab',
        unlockCondition: { upgrades: ['advanced_lab_upgrade_1'] }
    },
    
    advanced_lab_upgrade_electric: {
        name: 'AI Research Network',
        description: 'Artificial intelligence conducts autonomous research - 5x discovery acceleration',
        cost: { electricity: 2000, computers: 200, robots: 150 },
        effect: { buildingMultiplier: { advancedLab: 5 } },
        category: 'electricity',
        building: 'advancedLab',
        unlockCondition: { upgrades: ['advanced_lab_upgrade_2'], buildings: { robotFactory: 2 } }
    },
    
    // =============================================================================
    // TIER 7: SPECIALIZED BUILDINGS (Mechanical → Optimized → Electric)
    // =============================================================================
    
    // ========== WATER PUMP UPGRADES ==========
    water_pump_upgrade_1: {
        name: 'Double-Acting Pump',
        description: 'Improved pump mechanism - doubles water extraction rate',
        cost: { ironPlates: 80, gears: 30 },
        effect: { buildingMultiplier: { waterPump: 2 } },
        category: 'building',
        building: 'waterPump',
        unlockCondition: { buildings: { waterPump: 2 } }
    },
    
    water_pump_upgrade_2: {
        name: 'Steam-Powered Pump',
        description: 'Steam engine drives water pumps - triples capacity',
        cost: { ironPlates: 300, gears: 120, steel: 50 },
        effect: { buildingMultiplier: { waterPump: 3 } },
        category: 'building',
        building: 'waterPump',
        unlockCondition: { upgrades: ['water_pump_upgrade_1'] }
    },
    
    water_pump_upgrade_electric: {
        name: 'Electric Water Station',
        description: 'High-pressure electric pumps - 5x water production',
        cost: { electricity: 400, circuits: 40, steel: 200 },
        effect: { buildingMultiplier: { waterPump: 5 } },
        category: 'electricity',
        building: 'waterPump',
        unlockCondition: { upgrades: ['water_pump_upgrade_2'], buildings: { steamEngine: 1 } }
    },
    
    // ========== PUMPJACK UPGRADES ==========
    pumpjack_upgrade_1: {
        name: 'Enhanced Drilling',
        description: 'Deeper drilling technology - doubles oil extraction',
        cost: { steel: 200, engines: 15, circuits: 30 },
        effect: { buildingMultiplier: { pumpjack: 2 } },
        category: 'building',
        building: 'pumpjack',
        unlockCondition: { buildings: { pumpjack: 2 } }
    },
    
    pumpjack_upgrade_2: {
        name: 'Multi-Well System',
        description: 'Multiple extraction points - triples oil production',
        cost: { steel: 600, engines: 60, circuits: 100 },
        effect: { buildingMultiplier: { pumpjack: 3 } },
        category: 'building',
        building: 'pumpjack',
        unlockCondition: { upgrades: ['pumpjack_upgrade_1'] }
    },
    
    pumpjack_upgrade_electric: {
        name: 'Automated Oil Platform',
        description: 'Computer-controlled extraction - 5x oil efficiency',
        cost: { electricity: 800, circuits: 120, computers: 30 },
        effect: { buildingMultiplier: { pumpjack: 5 } },
        category: 'electricity',
        building: 'pumpjack',
        unlockCondition: { upgrades: ['pumpjack_upgrade_2'], buildings: { processingUnit: 1 } }
    },
    
    // ========== CHEMICAL PLANT UPGRADES ==========
    chemical_plant_upgrade_1: {
        name: 'Reaction Chambers',
        description: 'Specialized chemical processing chambers - doubles efficiency',
        cost: { steel: 300, plastic: 100, circuits: 50 },
        effect: { buildingMultiplier: { chemicalPlant: 2 } },
        category: 'building',
        building: 'chemicalPlant',
        unlockCondition: { buildings: { chemicalPlant: 2 } }
    },
    
    chemical_plant_upgrade_2: {
        name: 'Catalytic Processing',
        description: 'Advanced catalysts accelerate reactions - triples output',
        cost: { steel: 800, plastic: 400, engines: 30 },
        effect: { buildingMultiplier: { chemicalPlant: 3 } },
        category: 'building',
        building: 'chemicalPlant',
        unlockCondition: { upgrades: ['chemical_plant_upgrade_1'] }
    },
    
    chemical_plant_upgrade_electric: {
        name: 'Automated Refinery',
        description: 'Computer-controlled chemical processing - 5x production',
        cost: { electricity: 1000, circuits: 150, computers: 40 },
        effect: { buildingMultiplier: { chemicalPlant: 5 } },
        category: 'electricity',
        building: 'chemicalPlant',
        unlockCondition: { upgrades: ['chemical_plant_upgrade_2'], buildings: { processingUnit: 1 } }
    },
    
    // ========== PROCESSING UNIT UPGRADES ==========
    processing_unit_upgrade_1: {
        name: 'Advanced Fabrication',
        description: 'Improved chip manufacturing - doubles processing unit quality',
        cost: { computers: 50, circuits: 300, plastic: 200 },
        effect: { buildingMultiplier: { processingUnit: 2 } },
        category: 'building',
        building: 'processingUnit',
        unlockCondition: { buildings: { processingUnit: 2 } }
    },
    
    processing_unit_upgrade_2: {
        name: 'Clean Room Production',
        description: 'Sterile environment increases yield - triples output',
        cost: { computers: 200, circuits: 800, engines: 50 },
        effect: { buildingMultiplier: { processingUnit: 3 } },
        category: 'building',
        building: 'processingUnit',
        unlockCondition: { upgrades: ['processing_unit_upgrade_1'] }
    },
    
    processing_unit_upgrade_electric: {
        name: 'Quantum Processing Fab',
        description: 'Quantum-enhanced manufacturing - 5x processing power',
        cost: { electricity: 1500, circuits: 400, computers: 100 },
        effect: { buildingMultiplier: { processingUnit: 5 } },
        category: 'electricity',
        building: 'processingUnit',
        unlockCondition: { upgrades: ['processing_unit_upgrade_2'], buildings: { robotFactory: 1 } }
    },
    
    // ========== ROBOT FACTORY UPGRADES ==========
    robot_factory_upgrade_1: {
        name: 'Assembly Automation',
        description: 'Automated robot assembly - doubles production rate',
        cost: { robots: 50, computers: 100, circuits: 400 },
        effect: { buildingMultiplier: { robotFactory: 2 } },
        category: 'building',
        building: 'robotFactory',
        unlockCondition: { buildings: { robotFactory: 2 } }
    },
    
    robot_factory_upgrade_2: {
        name: 'Self-Replicating Systems',
        description: 'Robots help build more robots - triples efficiency',
        cost: { robots: 200, computers: 400, engines: 100 },
        effect: { buildingMultiplier: { robotFactory: 3 } },
        category: 'building',
        building: 'robotFactory',
        unlockCondition: { upgrades: ['robot_factory_upgrade_1'] }
    },
    
    robot_factory_upgrade_electric: {
        name: 'AI Robot Manufacturing',
        description: 'Artificial intelligence designs and builds robots - 5x production',
        cost: { electricity: 2500, computers: 300, robots: 400 },
        effect: { buildingMultiplier: { robotFactory: 5 } },
        category: 'electricity',
        building: 'robotFactory',
        unlockCondition: { upgrades: ['robot_factory_upgrade_2'], buildings: { advancedLab: 1 } }
    },
    
    // =============================================================================
    // GLOBAL FACTORY OPTIMIZATION UPGRADES
    // =============================================================================
    
    factory_optimization_1: {
        name: 'Logistics Network',
        description: 'Optimized material flow between all buildings - 25% global efficiency',
        cost: { circuits: 500, gears: 1000, steel: 800 },
        effect: { globalMultiplier: 1.25 },
        category: 'global',
        unlockCondition: { buildings: { circuitAssembler: 3, gearAssembler: 3 } }
    },
    
    factory_optimization_2: {
        name: 'Industrial Automation',
        description: 'Factory-wide automation systems - 50% global production boost',
        cost: { engines: 200, circuits: 1000, computers: 100 },
        effect: { globalMultiplier: 1.5 },
        category: 'global',
        unlockCondition: { upgrades: ['factory_optimization_1'] }
    },
    
    factory_optimization_electric: {
        name: 'Smart Factory Network',
        description: 'AI-controlled factory optimization - 100% global efficiency revolution',
        cost: { electricity: 3000, computers: 500, robots: 200 },
        effect: { globalMultiplier: 2 },
        category: 'global',
        unlockCondition: { upgrades: ['factory_optimization_2'], buildings: { robotFactory: 2 } }
    }
};

// Helper functions
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

function getBuildingUpgradeChain(buildingKey) {
    const upgrades = getUpgradesForBuilding(buildingKey);
    return upgrades.sort((a, b) => {
        // Sort by: base upgrades first, then electric
        if (a.category === 'electricity' && b.category !== 'electricity') return 1;
        if (b.category === 'electricity' && a.category !== 'electricity') return -1;
        return a.id.localeCompare(b.id);
    });
}