// Oddiy xotiradagi tezlik cheklovchi (bitta jarayon uchun).
function createLimiter({ windowMs, max, keyFn, message } = {}) {
    const hits = new Map(); // key -> { count, resetAt }
    const now = () => Date.now();

    // Sof hisoblash: { allowed, remaining, retryAfterMs }
    function hit(key, at = now()) {
        let entry = hits.get(key);
        if (!entry || entry.resetAt <= at) {
            entry = { count: 0, resetAt: at + windowMs };
            hits.set(key, entry);
        }
        entry.count += 1;
        const allowed = entry.count <= max;
        return {
            allowed,
            remaining: Math.max(0, max - entry.count),
            retryAfterMs: allowed ? 0 : entry.resetAt - at
        };
    }

    function sweep(at = now()) {
        for (const [k, v] of hits) {
            if (v.resetAt <= at) hits.delete(k);
        }
    }
    const timer = setInterval(sweep, Math.max(windowMs, 1000));
    if (timer.unref) timer.unref();

    function middleware(req, res, next) {
        const key = keyFn ? keyFn(req) : (req.ip || 'anon');
        const r = hit(String(key));
        if (!r.allowed) {
            res.set('Retry-After', String(Math.ceil(r.retryAfterMs / 1000)));
            return res.status(429).json({ error: message || "So'rovlar juda ko'p. Birozdan keyin qaytadan urinib ko'ring." });
        }
        return next();
    }
    middleware.hit = hit;
    middleware.sweep = sweep;
    middleware.reset = () => hits.clear();
    middleware.forget = (key) => hits.delete(String(key));
    middleware.size = () => hits.size;
    return middleware;
}

module.exports = createLimiter;
