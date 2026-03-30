const NodeCache = require('node-cache');

// Cache configuration
// TTL: Time To Live in seconds
// Checkperiod: How often to check for expired keys (in seconds)
const cache = new NodeCache({
    stdTTL: 30, // 30 seconds default TTL
    checkperiod: 60, // Check for expired keys every 60 seconds
    useClones: false, // Don't clone objects (better performance)
});

module.exports = cache;
