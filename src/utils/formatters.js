// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Format large numbers with appropriate suffixes (K, M, B, etc.)
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
function formatNumber(num, decimals = 1) {
    if (num < 1) return num.toFixed(2);
    if (num < 1000) return Math.floor(num).toString();
    
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const tier = Math.floor(Math.log10(num) / 3);
    
    if (tier > suffixes.length - 1) {
        return num.toExponential(decimals);
    }
    
    const scaled = num / Math.pow(1000, tier);
    return scaled.toFixed(decimals) + suffixes[tier];
}

/**
 * Format time duration into human-readable string
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Format a percentage with appropriate precision
 * @param {number} value - The decimal value (e.g., 0.15 for 15%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
function formatPercent(value, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format resource cost display
 * @param {Object} cost - Cost object with resource requirements
 * @param {number} multiplier - Optional cost multiplier
 * @returns {string} Formatted cost string
 */
function formatCost(cost, multiplier = 1) {
    if (!cost || Object.keys(cost).length === 0) return 'Free';
    
    return Object.entries(cost)
        .map(([resource, amount]) => {
            const icon = RESOURCES[resource]?.icon || '❓';
            const finalAmount = amount * multiplier;
            return `${icon} ${formatNumber(finalAmount)}`;
        })
        .join(' ');
}

/**
 * Format production/consumption rates
 * @param {number} rate - Rate per second
 * @param {boolean} showSign - Whether to show + or - sign
 * @returns {string} Formatted rate string
 */
function formatRate(rate, showSign = true) {
    if (rate === 0) return '0/s';
    
    const sign = showSign ? (rate > 0 ? '+' : '') : '';
    return `${sign}${formatNumber(Math.abs(rate))}/s`;
}

/**
 * Format a date/time for display
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString();
}

/**
 * Get pluralized form of a word
 * @param {number} count - The count to check
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, adds 's' if not provided)
 * @returns {string} Appropriate form based on count
 */
function pluralize(count, singular, plural = null) {
    if (count === 1) return singular;
    return plural || singular + 's';
}

/**
 * Format building efficiency
 * @param {number} efficiency - Efficiency multiplier
 * @returns {string} Formatted efficiency string
 */
function formatEfficiency(efficiency) {
    if (efficiency === 1) return 'x1.00';
    return `x${efficiency.toFixed(2)}`;
}

/**
 * Create a progress bar string (for text-based progress display)
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @param {number} width - Bar width in characters
 * @returns {string} Progress bar string
 */
function createProgressBar(current, max, width = 20) {
    const percentage = Math.min(current / max, 1);
    const filled = Math.floor(percentage * width);
    const empty = width - filled;
    
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${formatPercent(percentage)}`;
}