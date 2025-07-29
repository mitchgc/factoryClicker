// =============================================================================
// SIMPLE TABLE UI SYSTEM
// =============================================================================

/**
 * Unified table-based UI that displays resources, buildings, and upgrades
 * in a single table as shown in the HTML structure
 */
const SimpleTableUI = (function() {
    
    let initialized = false;
    let tableStructure = null;
    let lastResourceOrder = [];
    let lastBuildingOrder = [];
    let lastUpgradeOrder = [];
    
    /**
     * Initialize the table UI
     */
    function initialize() {
        if (initialized) return;
        
        console.log('🖥️ Initializing SimpleTableUI...');
        
        // Check if required systems are available and initialized
        if (typeof ResourceSystem === 'undefined' || 
            typeof BuildingSystem === 'undefined' || 
            typeof UpgradeSystem === 'undefined' ||
            typeof GameState === 'undefined' ||
            !GameState.getState) {
            console.warn('Required systems not ready, retrying SimpleTableUI initialization in 100ms...');
            setTimeout(initialize, 100);
            return;
        }
        
        // Build initial table structure
        buildInitialTable();
        
        // Set up periodic updates (less frequent to avoid flashing)
        setInterval(updateValues, 500); // Update values only twice per second
        
        initialized = true;
        console.log('✅ SimpleTableUI initialized');
    }
    
    /**
     * Build the initial table structure once
     */
    function buildInitialTable() {
        const tbody = document.getElementById('game-table-body');
        if (!tbody) return;
        
        const state = GameState.getState();
        
        // Get current data using new aligned system
        const alignedTableData = getAlignedTableData(state);
        const unlockedResources = alignedTableData.map(row => row.resource);
        const unlockedBuildings = alignedTableData.map(row => row.building);
        const availableUpgrades = alignedTableData.map(row => row.upgrade);
        
        // Debug: Log the alignment to check for issues
        console.log('🔍 Perfect 1-1-1 Alignment Debug:');
        alignedTableData.forEach((row, i) => {
            console.log(`Row ${i}:`, 
                row.resource.key, 
                '→', row.building ? row.building.key : 'null', 
                '→', row.upgrade ? row.upgrade.key : 'null'
            );
        });
        
        // Store current order (handle null buildings and upgrades)
        lastResourceOrder = unlockedResources.map(r => r.key);
        lastBuildingOrder = unlockedBuildings.map(b => b ? b.key : null);
        lastUpgradeOrder = availableUpgrades.map(u => u ? u.key : null);
        
        // Clear and build table
        tbody.innerHTML = '';
        
        const maxRows = Math.max(unlockedResources.length, unlockedBuildings.length, availableUpgrades.length);
        
        for (let i = 0; i < maxRows; i++) {
            const row = document.createElement('tr');
            row.className = 'game-row';
            row.dataset.rowIndex = i;
            
            // Resource columns
            if (i < unlockedResources.length) {
                const resource = unlockedResources[i];
                row.appendChild(createResourceNameCell(resource));
                row.appendChild(createResourceAmountCell(resource, state));
                row.appendChild(createResourceIncomeCell(resource));
                row.appendChild(createResourceExpenseCell(resource));
            } else {
                // Empty resource cells
                for (let j = 0; j < 4; j++) {
                    row.appendChild(createEmptyCell());
                }
            }
            
            // Building columns
            if (i < unlockedBuildings.length) {
                const building = unlockedBuildings[i];
                if (building) {
                    row.appendChild(createBuildingNameCell(building));
                    row.appendChild(createBuildingBenefitCell(building, state));
                    row.appendChild(createBuildingOwnedCell(building, state));
                    row.appendChild(createBuildingCostCell(building, state));
                    row.appendChild(createBuildingActionCell(building));
                } else {
                    // Empty building cells for perfect alignment when building not unlocked
                    for (let j = 0; j < 5; j++) {
                        row.appendChild(createEmptyCell());
                    }
                }
            } else {
                // Empty building cells
                for (let j = 0; j < 5; j++) {
                    row.appendChild(createEmptyCell());
                }
            }
            
            // Upgrade columns
            if (i < availableUpgrades.length) {
                const upgrade = availableUpgrades[i];
                if (upgrade) {
                    row.appendChild(createUpgradeNameCell(upgrade));
                    row.appendChild(createUpgradeBenefitCell(upgrade));
                    row.appendChild(createUpgradeStatusCell(upgrade, state));
                    row.appendChild(createUpgradeCostCell(upgrade, state));
                    row.appendChild(createUpgradeActionCell(upgrade, state));
                } else {
                    // Empty upgrade cells for perfect alignment when no upgrade exists
                    for (let j = 0; j < 5; j++) {
                        row.appendChild(createEmptyCell());
                    }
                }
            } else {
                // Empty upgrade cells
                for (let j = 0; j < 5; j++) {
                    row.appendChild(createEmptyCell());
                }
            }
            
            tbody.appendChild(row);
        }
        
        tableStructure = { alignedTableData, unlockedResources, unlockedBuildings, availableUpgrades };
    }
    
    /**
     * Update only the values that change, without rebuilding DOM
     */
    function updateValues() {
        const tbody = document.getElementById('game-table-body');
        if (!tbody || !tableStructure) return;
        
        const state = GameState.getState();
        
        // Check if we need to rebuild (new unlocks)
        const currentAlignedData = getAlignedTableData(state);
        const currentResourceOrder = currentAlignedData.map(row => row.resource.key);
        const currentBuildingOrder = currentAlignedData.map(row => row.building ? row.building.key : null);
        const currentUpgradeOrder = currentAlignedData.map(row => row.upgrade ? row.upgrade.key : null);
        
        if (!arraysEqual(currentResourceOrder, lastResourceOrder) ||
            !arraysEqual(currentBuildingOrder, lastBuildingOrder) ||
            !arraysEqual(currentUpgradeOrder, lastUpgradeOrder)) {
            // Structure changed, rebuild
            buildInitialTable();
            return;
        }
        
        // Update only values
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach((row, i) => {
            // Update resource values
            if (i < tableStructure.unlockedResources.length) {
                const resource = tableStructure.unlockedResources[i];
                const rates = ResourceSystem ? ResourceSystem.calculateRates(resource.key) : { production: 0, consumption: 0, net: 0 };
                
                // Update amount
                const amountCell = row.children[1];
                if (amountCell) {
                    amountCell.textContent = formatNumber(state.resources[resource.key]);
                }
                
                // Update income
                const incomeCell = row.children[2];
                if (incomeCell) {
                    incomeCell.textContent = rates.production > 0 ? `+${formatNumber(rates.production)}/s` : '-';
                }
                
                // Update expense
                const expenseCell = row.children[3];
                if (expenseCell) {
                    expenseCell.textContent = rates.consumption > 0 ? `-${formatNumber(rates.consumption)}/s` : '-';
                }
            }
            
            // Update building values
            if (i < tableStructure.unlockedBuildings.length) {
                const building = tableStructure.unlockedBuildings[i];
                const buildingState = state.buildings[building.key];
                
                // Update benefit cell with current sustainability info
                const benefitCell = row.children[5];
                if (benefitCell) {
                    const newBenefitCell = createBuildingBenefitCell(building, state);
                    benefitCell.innerHTML = newBenefitCell.innerHTML;
                }
                
                // Update owned count
                const ownedCell = row.children[6];
                if (ownedCell) {
                    ownedCell.textContent = buildingState.count.toString();
                }
                
                // Update cost and button state
                const newCost = BuildingSystem ? BuildingSystem.getBuildingCost(building.key, buildingState.count) : {};
                const canBuild = BuildingSystem ? BuildingSystem.canBuild(building.key) : false;
                
                const costCell = row.children[7];
                const actionCell = row.children[8];
                
                if (costCell) {
                    updateCostCell(costCell, newCost, state);
                }
                
                if (actionCell) {
                    const button = actionCell.querySelector('button');
                    if (button) {
                        button.className = `btn ${canBuild ? 'btn-primary' : 'btn-disabled'} btn-small`;
                        button.disabled = !canBuild;
                    }
                }
            }
        });
    }
    
    /**
     * Perfect 1-1-1 Resource-Building-Upgrade alignment mappings
     */
    function getPerfectAlignmentMappings() {
        return [
            // Perfect 1-1-1 alignments (resource -> primary building -> next available upgrade)
            { resource: 'ironOre', building: 'ironMine', upgradePrefix: 'iron_mine_upgrade' },
            { resource: 'copperOre', building: 'copperMine', upgradePrefix: 'copper_mine_upgrade' },
            { resource: 'coal', building: 'coalMine', upgradePrefix: 'coal_mine_upgrade' },
            { resource: 'stone', building: 'stoneQuarry', upgradePrefix: 'stone_quarry_upgrade' },
            { resource: 'ironPlates', building: 'stoneFurnace', upgradePrefix: 'stone_furnace_upgrade' },
            { resource: 'copperPlates', building: 'copperFurnace', upgradePrefix: 'copper_furnace_upgrade' },
            { resource: 'gears', building: 'manualGearPress', upgradePrefix: 'manual_gear_press_upgrade' },
            { resource: 'water', building: 'waterPump', upgradePrefix: 'water_pump_upgrade' },
            { resource: 'electricity', building: 'steamEngine', upgradePrefix: 'steam_engine_upgrade' },
            { resource: 'copperCables', building: 'cableAssembler', upgradePrefix: 'cable_assembler_upgrade' },
            { resource: 'steel', building: 'steelFurnace', upgradePrefix: 'steel_furnace_upgrade' },
            { resource: 'circuits', building: 'circuitAssembler', upgradePrefix: 'circuit_assembler_upgrade' },
            { resource: 'engines', building: 'engineAssembler', upgradePrefix: 'engine_assembler_upgrade' },
            { resource: 'oil', building: 'pumpjack', upgradePrefix: 'pumpjack_upgrade' },
            { resource: 'plastic', building: 'chemicalPlant', upgradePrefix: 'chemical_plant_upgrade' },
            { resource: 'assemblers', building: 'assemblingMachine', upgradePrefix: 'assembling_machine_upgrade' },
            { resource: 'computers', building: 'processingUnit', upgradePrefix: 'processing_unit_upgrade' },
            { resource: 'robots', building: 'robotFactory', upgradePrefix: 'robot_factory_upgrade' },
            { resource: 'researchPoints', building: 'researchLab', upgradePrefix: 'research_lab_upgrade' },
        ];
    }
    
    /**
     * Find the next available upgrade for a building
     * @param {string} upgradePrefix - Prefix for upgrade IDs (e.g., 'iron_mine_upgrade')
     * @param {Array} purchasedUpgrades - List of already purchased upgrades
     * @returns {string|null} Next upgrade ID or null
     */
    function getNextBuildingUpgrade(upgradePrefix, purchasedUpgrades) {
        if (!upgradePrefix) return null;
        
        // Check if UpgradeSystem is available
        if (typeof UpgradeSystem === 'undefined') {
            return null;
        }
        
        // Try upgrades in order: _1, _2, _electric
        const upgradeOrder = ['_1', '_2', '_electric'];
        
        for (const suffix of upgradeOrder) {
            const upgradeId = upgradePrefix + suffix;
            if (UPGRADES[upgradeId] && !purchasedUpgrades.includes(upgradeId)) {
                // Check if this upgrade is unlocked
                if (UpgradeSystem.isUnlocked(upgradeId)) {
                    return upgradeId;
                }
            }
        }
        
        return null; // All upgrades purchased or none available
    }
    
    /**
     * Get aligned table data (ensures perfect 1-1-1 synchronization)
     */
    function getAlignedTableData(state) {
        // Check if required systems are available
        if (typeof ResourceSystem === 'undefined' || typeof BuildingSystem === 'undefined') {
            console.warn('Required systems not yet loaded, returning empty data');
            return [];
        }
        
        const alignmentMappings = getPerfectAlignmentMappings();
        const alignedData = [];
        
        // Process each mapping to build synchronized rows
        alignmentMappings.forEach(mapping => {
            const resourceUnlocked = state.unlockedResources[mapping.resource] && state.resources[mapping.resource] !== undefined;
            const buildingUnlocked = state.buildings[mapping.building] && state.buildings[mapping.building].unlocked;
            
            // Find the next available upgrade for this building
            const nextUpgradeId = getNextBuildingUpgrade(mapping.upgradePrefix, state.purchasedUpgrades);
            const upgradeAvailable = nextUpgradeId && UPGRADES[nextUpgradeId];
            
            // Only include this row if the resource is unlocked (the main condition)
            if (resourceUnlocked) {
                alignedData.push({
                    resource: {
                        key: mapping.resource,
                        amount: state.resources[mapping.resource],
                        rates: ResourceSystem.calculateRates(mapping.resource),
                        definition: RESOURCES[mapping.resource],
                        alignedBuilding: mapping.building,
                        alignedUpgrade: nextUpgradeId
                    },
                    building: buildingUnlocked ? {
                        key: mapping.building,
                        building: state.buildings[mapping.building],
                        definition: BUILDINGS[mapping.building],
                        cost: BuildingSystem.getBuildingCost(mapping.building, state.buildings[mapping.building].count),
                        canBuild: BuildingSystem.canBuild(mapping.building),
                        alignedResource: mapping.resource,
                        alignedUpgrade: nextUpgradeId
                    } : null,
                    upgrade: upgradeAvailable ? {
                        key: nextUpgradeId,
                        upgrade: UPGRADES[nextUpgradeId],
                        canAfford: ResourceSystem.canAfford(UPGRADES[nextUpgradeId].cost),
                        canPurchase: UpgradeSystem.canPurchase(nextUpgradeId),
                        alignedResource: mapping.resource,
                        alignedBuilding: mapping.building
                    } : null
                });
            }
        });
        
        return alignedData;
    }
    
    /**
     * Get unlocked resources in perfect 1-1-1 alignment order (legacy compatibility)
     */
    function getUnlockedResourcesOrdered(state) {
        return getAlignedTableData(state).map(row => row.resource);
    }
    
    /**
     * Get unlocked buildings in perfect 1-1-1 alignment order (legacy compatibility)
     */
    function getUnlockedBuildingsOrdered(state) {
        return getAlignedTableData(state).map(row => row.building);
    }
    
    /**
     * Get available upgrades in perfect 1-1-1 alignment order (legacy compatibility)
     */
    function getAvailableUpgrades(state) {
        return getAlignedTableData(state).map(row => row.upgrade);
    }
    
    /**
     * Compare two arrays for equality
     */
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    
    /**
     * Find the main building that produces a resource
     * @param {string} resourceKey - The resource to find producer for
     * @returns {Object|null} Building definition or null
     */
    function findMainProducingBuilding(resourceKey) {
        // Look for buildings that produce this resource
        const producers = Object.entries(BUILDINGS).filter(([buildingKey, building]) => {
            return building.produces && building.produces[resourceKey];
        });
        
        if (producers.length === 0) return null;
        
        // Priority order for showing the most relevant building
        const priorityBuildings = [
            // For electricity, prioritize steam engine over alternatives
            'steamEngine', 'solarPanel', 'coalGasifier', 'windTurbine',
            // For basic resources, prefer basic buildings
            'ironMine', 'copperMine', 'coalMine', 'stoneQuarry',
            // For processed materials, prefer basic processors
            'stoneFurnace', 'copperFurnace', 'steelFurnace',
            // Manufacturing buildings
            'manualGearPress', 'gearAssembler', 'cableAssembler', 'circuitAssembler'
        ];
        
        // Find the highest priority producer
        for (const priorityBuilding of priorityBuildings) {
            const found = producers.find(([key]) => key === priorityBuilding);
            if (found) {
                return found[1]; // Return building definition
            }
        }
        
        // If no priority match, return the first producer
        return producers[0][1];
    }
    
    /**
     * Update cost cell without rebuilding
     */
    function updateCostCell(cell, cost, state) {
        const costEntries = Object.entries(cost);
        if (costEntries.length === 0) {
            cell.textContent = 'Free';
            return;
        }
        
        const costHtml = costEntries.map(([resource, amount]) => {
            const resourceDef = RESOURCES[resource];
            const icon = resourceDef?.icon || '📦';
            
            // Use the centralized ResourceSystem.canAfford check for single resource
            const singleResourceCost = { [resource]: amount };
            const canAfford = ResourceSystem.canAfford(singleResourceCost);
            const className = canAfford ? 'cost-affordable' : 'cost-unaffordable clickable';
            const onclick = canAfford ? '' : ` onclick="SimpleTableUI.scrollToResource('${resource}')"`;
            
            return `<span class="${className}"${onclick}>${icon}${formatNumber(amount)}</span>`;
        }).join(' ');
        
        cell.innerHTML = costHtml;
    }
    
    // Cell creation functions
    function createResourceNameCell(resource) {
        const cell = document.createElement('td');
        cell.className = 'resource-name';
        
        const icon = resource.definition?.icon || '📦';
        const name = resource.definition?.name || resource.key;
        const color = resource.definition?.color || '#666666';
        
        cell.innerHTML = `
            <div class="resource-item">
                <span class="resource-icon" style="font-size: 1.2em;">${icon}</span>
                <span class="resource-label" style="color: ${color}; font-weight: 500;">${name}</span>
            </div>
        `;
        
        return cell;
    }
    
    function createResourceAmountCell(resource, state) {
        const cell = document.createElement('td');
        cell.className = 'resource-amount';
        cell.textContent = formatNumber(resource.amount);
        return cell;
    }
    
    
    function createResourceIncomeCell(resource) {
        const cell = document.createElement('td');
        cell.className = 'resource-income';
        cell.textContent = resource.rates.production > 0 ? `+${formatNumber(resource.rates.production)}/s` : '-';
        return cell;
    }
    
    function createResourceExpenseCell(resource) {
        const cell = document.createElement('td');
        cell.className = 'resource-expense';
        cell.textContent = resource.rates.consumption > 0 ? `-${formatNumber(resource.rates.consumption)}/s` : '-';
        return cell;
    }
    
    function createBuildingNameCell(building) {
        const cell = document.createElement('td');
        cell.className = 'building-name';
        
        const icon = building.definition?.icon || '🏗️';
        const name = building.definition?.name || building.key;
        
        cell.innerHTML = `
            <div class="building-item">
                <span class="building-icon">${icon}</span>
                <span class="building-label">${name}</span>
            </div>
        `;
        
        return cell;
    }
    
    function createBuildingBenefitCell(building, state) {
        const cell = document.createElement('td');
        cell.className = 'building-benefit';
        
        const produces = Object.entries(building.definition.produces || {});
        const consumes = Object.entries(building.definition.consumes || {});
        
        // Check resource sustainability for this building using actual multipliers
        const wouldCauseNegative = {};
        if (state && ResourceSystem) {
            // Get multipliers for accurate calculation
            const buildingMultiplier = UpgradeSystem.getBuildingMultiplier(building.key);
            const globalMultiplier = UpgradeSystem.getGlobalMultiplier();
            const researchBonus = ResearchSystem.getResearchBonus();
            const totalMultiplier = state.globalMultiplier * buildingMultiplier * globalMultiplier * researchBonus;
            
            consumes.forEach(([resource, consumptionRate]) => {
                const currentRates = ResourceSystem.calculateRates(resource);
                const actualBuildingRate = building.definition.baseProduction * consumptionRate * totalMultiplier;
                
                // Check if adding one more of this building would make net negative
                if (currentRates.net - actualBuildingRate < 0) {
                    wouldCauseNegative[resource] = true;
                }
            });
        }
        
        let benefit = '';
        if (produces.length > 0) {
            // Get multipliers for accurate production display
            const buildingMultiplier = UpgradeSystem.getBuildingMultiplier(building.key);
            const globalMultiplier = UpgradeSystem.getGlobalMultiplier();
            const researchBonus = ResearchSystem.getResearchBonus();
            const totalMultiplier = state.globalMultiplier * buildingMultiplier * globalMultiplier * researchBonus;
            
            benefit += produces.map(([resource, rate]) => {
                const resourceDef = RESOURCES[resource];
                const icon = resourceDef?.icon || '📦';
                const resourceName = resourceDef?.name || resource;
                const actualRate = building.definition.baseProduction * rate * totalMultiplier;
                return `<span style="color: #28a745;" title="Produces ${resourceName}">${icon} +${formatNumber(actualRate)}/s</span>`;
            }).join(' ');
        }
        
        if (consumes.length > 0) {
            if (benefit) benefit += '<br>';
            // Use the same multipliers for consumption display
            const buildingMultiplier = UpgradeSystem.getBuildingMultiplier(building.key);
            const globalMultiplier = UpgradeSystem.getGlobalMultiplier();
            const researchBonus = ResearchSystem.getResearchBonus();
            const totalMultiplier = state.globalMultiplier * buildingMultiplier * globalMultiplier * researchBonus;
            
            benefit += consumes.map(([resource, rate]) => {
                const resourceDef = RESOURCES[resource];
                const icon = resourceDef?.icon || '📦';
                const resourceName = resourceDef?.name || resource;
                const actualRate = building.definition.baseProduction * rate * totalMultiplier;
                const isNegative = wouldCauseNegative[resource];
                const style = isNegative ? 
                    'color: #dc3545; font-weight: bold; text-decoration: underline; cursor: pointer;' : 
                    'color: #6c757d;';
                const warningIcon = isNegative ? '⚠️ ' : '';
                const onclick = isNegative ? ` onclick="SimpleTableUI.scrollToResource('${resource}')"` : '';
                const title = isNegative ? `Not enough ${resourceName}! Click to see resource.` : `Consumes ${resourceName}`;
                
                return `<span style="${style}" title="${title}"${onclick}>${warningIcon}${icon} -${formatNumber(actualRate)}/s</span>`;
            }).join(' ');
        }
        
        cell.innerHTML = benefit || 'Utility';
        return cell;
    }
    
    function createBuildingOwnedCell(building, state) {
        const cell = document.createElement('td');
        cell.className = 'building-owned';
        cell.textContent = building.building.count.toString();
        return cell;
    }
    
    function createBuildingCostCell(building, state) {
        const cell = document.createElement('td');
        cell.className = 'building-cost';
        
        const costEntries = Object.entries(building.cost);
        if (costEntries.length === 0) {
            cell.textContent = 'Free';
            return cell;
        }
        
        const costHtml = costEntries.map(([resource, amount]) => {
            const resourceDef = RESOURCES[resource];
            const icon = resourceDef?.icon || '📦';
            
            // Use the centralized ResourceSystem.canAfford check for single resource
            const singleResourceCost = { [resource]: amount };
            const canAfford = ResourceSystem.canAfford(singleResourceCost);
            const className = canAfford ? 'cost-affordable' : 'cost-unaffordable clickable';
            const onclick = canAfford ? '' : ` onclick="SimpleTableUI.scrollToResource('${resource}')"`;
            
            return `<span class="${className}"${onclick}>${icon}${formatNumber(amount)}</span>`;
        }).join(' ');
        
        cell.innerHTML = costHtml;
        return cell;
    }
    
    function createBuildingActionCell(building) {
        const cell = document.createElement('td');
        cell.className = 'building-action';
        
        const button = document.createElement('button');
        button.className = `btn ${building.canBuild ? 'btn-primary' : 'btn-disabled'} btn-small`;
        button.textContent = 'Build';
        button.disabled = !building.canBuild;
        button.onclick = () => {
            if (BuildingSystem.build(building.key)) {
                // Success handled by state change
            }
        };
        
        cell.appendChild(button);
        return cell;
    }
    
    function createUpgradeNameCell(upgrade) {
        const cell = document.createElement('td');
        cell.className = 'upgrade-name';
        
        if (!upgrade) {
            cell.innerHTML = '&nbsp;';
            return cell;
        }
        
        const icon = upgrade.upgrade?.icon || '⬆️';
        const name = upgrade.upgrade?.name || upgrade.key;
        
        cell.innerHTML = `
            <div class="upgrade-item">
                <span class="upgrade-icon">${icon}</span>
                <span class="upgrade-label">${name}</span>
            </div>
        `;
        
        return cell;
    }
    
    function createUpgradeBenefitCell(upgrade) {
        const cell = document.createElement('td');
        cell.className = 'upgrade-benefit';
        
        if (!upgrade) {
            cell.innerHTML = '&nbsp;';
            return cell;
        }
        
        const description = upgrade.upgrade?.description || 'Improvement';
        const effect = upgrade.upgrade?.effect;
        
        let benefitText = description;
        
        // Add specific effect information for clarity
        if (effect) {
            let effectInfo = [];
            
            if (effect.clickMultiplier) {
                effectInfo.push(`⛏️ Click power ×${effect.clickMultiplier}`);
            }
            
            if (effect.globalMultiplier) {
                effectInfo.push(`🌐 All production ×${effect.globalMultiplier}`);
            }
            
            if (effect.buildingMultiplier) {
                const buildings = Object.entries(effect.buildingMultiplier);
                buildings.forEach(([buildingKey, multiplier]) => {
                    const buildingDef = BUILDINGS[buildingKey];
                    const buildingName = buildingDef?.name || buildingKey;
                    const buildingIcon = buildingDef?.icon || '🏗️';
                    effectInfo.push(`${buildingIcon} ${buildingName} ×${multiplier}`);
                });
            }
            
            if (effect.researchMultiplier) {
                effectInfo.push(`🔬 Research bonus ×${effect.researchMultiplier}`);
            }
            
            if (effectInfo.length > 0) {
                benefitText += '<br><small style="color: #6c757d;">' + effectInfo.join(', ') + '</small>';
            }
        }
        
        cell.innerHTML = benefitText;
        return cell;
    }
    
    function createUpgradeStatusCell(upgrade, state) {
        const cell = document.createElement('td');
        cell.className = 'upgrade-status';
        
        if (!upgrade) {
            cell.innerHTML = '&nbsp;';
            return cell;
        }
        
        cell.textContent = state.purchasedUpgrades.includes(upgrade.key) ? 'Owned' : 'Available';
        return cell;
    }
    
    function createUpgradeCostCell(upgrade, state) {
        const cell = document.createElement('td');
        cell.className = 'upgrade-cost';
        
        if (!upgrade) {
            cell.innerHTML = '&nbsp;';
            return cell;
        }
        
        const costEntries = Object.entries(upgrade.upgrade.cost || {});
        if (costEntries.length === 0) {
            cell.textContent = 'Free';
            return cell;
        }
        
        const costHtml = costEntries.map(([resource, amount]) => {
            const resourceDef = RESOURCES[resource];
            const icon = resourceDef?.icon || '📦';
            
            // Use the centralized ResourceSystem.canAfford check for single resource
            const singleResourceCost = { [resource]: amount };
            const canAfford = ResourceSystem.canAfford(singleResourceCost);
            const className = canAfford ? 'cost-affordable' : 'cost-unaffordable clickable';
            const onclick = canAfford ? '' : ` onclick="SimpleTableUI.scrollToResource('${resource}')"`;
            
            return `<span class="${className}"${onclick}>${icon}${formatNumber(amount)}</span>`;
        }).join(' ');
        
        cell.innerHTML = costHtml;
        return cell;
    }
    
    function createUpgradeActionCell(upgrade, state) {
        const cell = document.createElement('td');
        cell.className = 'upgrade-action';
        
        if (!upgrade) {
            cell.innerHTML = '&nbsp;';
            return cell;
        }
        
        const button = document.createElement('button');
        const canPurchase = UpgradeSystem.canPurchase(upgrade.key);
        button.className = `btn ${canPurchase ? 'btn-primary' : 'btn-disabled'} btn-small`;
        button.textContent = 'Buy';
        button.disabled = !canPurchase;
        button.onclick = () => {
            if (UpgradeSystem.purchaseUpgrade(upgrade.key)) {
                // Success handled by state change
                console.log(`Purchased upgrade: ${upgrade.key}`);
            } else {
                console.log(`Failed to purchase upgrade: ${upgrade.key}`);
            }
        };
        
        cell.appendChild(button);
        return cell;
    }
    
    function createEmptyCell() {
        const cell = document.createElement('td');
        cell.className = 'empty-cell';
        cell.innerHTML = '&nbsp;';
        return cell;
    }
    
    /**
     * Scroll to a specific resource in the table
     * @param {string} resourceKey - The resource to scroll to
     */
    function scrollToResource(resourceKey) {
        const state = GameState.getState();
        const resources = getUnlockedResourcesOrdered(state);
        const resourceIndex = resources.findIndex(r => r.key === resourceKey);
        
        if (resourceIndex === -1) {
            console.log(`Resource ${resourceKey} not found in table`);
            return;
        }
        
        const tbody = document.getElementById('game-table-body');
        if (!tbody) return;
        
        const row = tbody.querySelector(`tr[data-row-index="${resourceIndex}"]`);
        if (row) {
            // Scroll to the row
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight the row briefly
            row.style.transition = 'background-color 0.3s ease';
            const originalBg = row.style.backgroundColor;
            row.style.backgroundColor = '#ffeb3b';
            setTimeout(() => {
                row.style.backgroundColor = originalBg;
            }, 2000);
        }
    }
    
    // Public API
    return {
        initialize,
        updateDisplay: buildInitialTable, // For compatibility
        updateValues,
        scrollToResource
    };
})();