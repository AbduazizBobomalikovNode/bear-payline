// Express 4 async handlerlardagi xatolarni (rejected promise) next(err) ga yo'naltiradi.
// Aks holda ushlanmagan xatolik jarayonni to'xtatadi yoki so'rov osilib qoladi.
const Layer = require('express/lib/router/layer');

if (!Layer.prototype.__asyncPatched) {
    Layer.prototype.handle_request = function handle(req, res, next) {
        const fn = this.handle;
        if (fn.length > 3) return next();
        try {
            const out = fn(req, res, next);
            if (out && typeof out.catch === 'function') out.catch(next);
        } catch (err) {
            next(err);
        }
    };
    Layer.prototype.__asyncPatched = true;
}
