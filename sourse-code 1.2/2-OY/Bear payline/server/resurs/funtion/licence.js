// Rol litsenziyasi: JSON matn, masalan {"card":["get","add"],"news":["get"]}.
// "*" kaliti yoki "*" amali hamma narsaga ruxsat beradi. Tushunarsiz format -> ruxsat yo'q.
function parseLicence(licence) {
    if (licence && typeof licence === 'object') return licence;
    if (typeof licence !== 'string') return {};
    try {
        const parsed = JSON.parse(licence);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        return {};
    }
}

function isAllowed(licence, resource, action) {
    const lic = parseLicence(licence);
    const check = (list) => Array.isArray(list) && (list.includes('*') || list.includes(action));
    return check(lic['*']) || (typeof resource === 'string' && Object.prototype.hasOwnProperty.call(lic, resource) && check(lic[resource]));
}

module.exports = { parseLicence, isAllowed };
