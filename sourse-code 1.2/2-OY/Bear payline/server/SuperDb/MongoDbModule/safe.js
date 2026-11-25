// NoSQL in'ektsiyadan himoya: tashqaridan kelgan qiymatlarni turlarga keltirish.

// id qiymatini songa aylantiradi. Son bo'lmasa NaN (hech narsaga mos kelmaydi) qaytaradi,
// shu tariqa { $gt: "" } kabi obyektlar filtrga o'tib ketmaydi.
function toNum(v) {
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() !== '' && /^-?\d+(\.\d+)?$/.test(v.trim())) return Number(v);
    return NaN;
}

function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// "$" bilan boshlanadigan yoki "." bor kalitlarni olib tashlaydi (chuqur).
function safeDoc(doc) {
    if (Array.isArray(doc)) return doc.map(safeDoc);
    if (!isPlainObject(doc)) return doc;
    const out = {};
    for (const key of Object.keys(doc)) {
        if (key.startsWith('$') || key.includes('.')) continue;
        out[key] = safeDoc(doc[key]);
    }
    return out;
}

// Filtr uchun: faqat primitiv qiymatlar ruxsat etiladi (string, number, boolean).
function safeFilter(obj) {
    const out = {};
    if (!isPlainObject(obj)) return out;
    for (const key of Object.keys(obj)) {
        const v = obj[key];
        if (key.startsWith('$') || key.includes('.')) {
            throw new TypeError('Noto\'g\'ri filtr kaliti');
        }
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
            out[key] = v;
        } else {
            throw new TypeError('Filtr qiymati oddiy tur bo\'lishi kerak');
        }
    }
    return out;
}

module.exports = { toNum, safeDoc, safeFilter };
