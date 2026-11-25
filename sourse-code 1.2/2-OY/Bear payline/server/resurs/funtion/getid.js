const crypto = require('crypto');

// num berilsa - num xonali, aks holda 8 xonali butun son (kriptografik tasodifiy).
function createUniqueRandomGenerator(num) {
    const digits = num ? num : 8;
    const min = 10 ** (digits - 1);
    const max = 10 ** digits;
    return crypto.randomInt(min, max);
}
module.exports = createUniqueRandomGenerator;
