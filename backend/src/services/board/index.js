const boardCacheService = require('./boardCacheService');
const boardMutationService = require('./boardMutationService');

module.exports = {
    ...boardCacheService,
    ...boardMutationService,
};
