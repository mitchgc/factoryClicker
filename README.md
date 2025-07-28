# City Production Tycoon

A simple web-based incremental city-building game. Start with wood and build a complex economy.

## 🎮 Quick Start

1. Open `game.html` in any browser
2. Click resources to gather them
3. Build structures to automate production
4. Upgrade and expand your city

## 📁 Project Structure

```
├── game.html              # Main game file
├── styles/
│   └── game.css           # All game styles
└── src/
    ├── data/              # Game definitions
    │   ├── constants.js
    │   ├── buildings.js
    │   ├── upgrades.js
    │   └── achievements.js
    ├── core/              # Core systems
    │   ├── gameState.js
    │   └── game.js
    ├── systems/           # Game mechanics
    │   ├── resourceSystem.js
    │   ├── buildingSystem.js
    │   ├── upgradeSystem.js
    │   ├── researchSystem.js
    │   ├── achievementSystem.js
    │   ├── tutorialSystem.js
    │   ├── autoBuildSystem.js
    │   ├── placementSystem.js
    │   └── specializationSystem.js
    └── utils/             # Utilities
        ├── formatters.js
        └── helpers.js
```

## 🏗️ Game Flow

1. **Wood** → Lumbermills → **Stone** → Mines → **Water** → Wells
2. **Grain** → Farms → **People** → Houses → **Gold** → Mines
3. **Energy** → Power Plants → **Knowledge** → Universities → **Culture** → Theaters

## 🛠️ Debug Commands

- `Game.reset()` - Reset game
- `addResources(resourceName, amount)` - Add resources
- `unlockAll()` - Unlock everything

Pure HTML/CSS/JS - no dependencies required.