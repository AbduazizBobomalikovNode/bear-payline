// 1) Sozlamalar (.env) va majburiy o'zgaruvchilar tekshiruvi - eng birinchi
const config = require('./config');
require('./middlewire/asyncErrors');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require('cors');
const helmet = require('helmet');
const { Expo } = require('expo-server-sdk');

var dbp = require('./SuperDb/main');
var parseDate = require('./resurs/funtion/formatDate');
var generateId = require('./resurs/funtion/getid');
var createLimiter = require('./resurs/funtion/rateLimit');
var { verifyToken } = require('./resurs/funtion/token');
var { canAccessUser } = require('./resurs/funtion/access');
var auth = require("./middlewire/auth");

//import  routers
var mainRouter = require('./routers/main');
var cardRouter = require('./routers/card');
var cardHasUserRouter = require('./routers/card_has_user');
var countryRouter = require('./routers/country');
var deviceRouter = require('./routers/device');
var documentRouter = require('./routers/document');
var newsRouter = require('./routers/news');
var partnerRouter = require('./routers/partner');
var paymentsRouter = require('./routers/payments');
var roleRouter = require('./routers/role');
var userRouter = require('./routers/user');
var authRouter = require('./routers/reg_auth');
// var authMessage = require('./routers/message');

// Productionda xabar matni va shaxsiy ma'lumotlar logga yozilmaydi
const debugLog = config.isProduction ? () => {} : (...args) => console.log(...args);

if (process.env.TRUST_PROXY) {
    app.set('trust proxy', /^\d+$/.test(process.env.TRUST_PROXY) ? Number(process.env.TRUST_PROXY) : process.env.TRUST_PROXY);
}

//use  plagins
app.use(helmet());
app.use(cors(config.corsOrigins.length ? { origin: config.corsOrigins } : undefined));
app.use(express.json({ limit: '100kb' }));
app.use('/images', express.static('images'));

//use  api routers
app.use('/', mainRouter);
app.use('/api/card', cardRouter);
app.use('/api/chu', cardHasUserRouter);

app.use('/api/country', countryRouter);
app.use('/api/device', deviceRouter);
app.use('/api/document', documentRouter);

app.use('/api/news', newsRouter);
app.use('/api/partner', partnerRouter);
app.use('/api/payments', paymentsRouter);

app.use('/api/role', roleRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
// app.use('/api/chat', authMessage);

// Chat socket.io orqali ishlaydi; bu yo'l endi faqat tokenni tekshiradi (har so'rovda listener qo'shilmaydi).
app.get('/chat', auth.authenticate, (req, res) => {
    res.json({ info: "socket.io orqali ulaning: token handshake.auth.token yoki x-web-token cookie/header orqali yuboriladi." });
});

const pushLimiter = createLimiter({ windowMs: 60 * 1000, max: 10, keyFn: (req) => (req.user ? 'u' + req.user.id : req.ip) });
app.post('/send-push', auth.authenticate, auth.requireAdmin, pushLimiter, (req, res) => {
    const { token, title, body } = req.body || {};

    if (!token || !title || !body) {
        return res.status(400).json({ error: 'token, title va body majburiy' });
    }
    if (typeof token !== 'string' || typeof title !== 'string' || typeof body !== 'string' ||
        !Expo.isExpoPushToken(token) || title.length > 100 || body.length > 500) {
        return res.status(400).json({ error: "token, title yoki body noto'g'ri" });
    }

    const expo = new Expo();
    const messages = [{
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: {
            extraData: "Ba'zi qo'shimcha ma'lumotlar"
        },
    }];

    expo.sendPushNotificationsAsync(messages)
        .then(response => {
            const receipts = response[0];
            const status = receipts.status;

            if (status === 'ok') {
                res.json({ message: 'Push xabarnoma yuborildi' });
            } else {
                res.status(500).json({ error: 'Push xabarnoma yuborilmadi' });
            }
        })
        .catch(error => {
            console.error('Push xatolik:', error.message);
            res.status(500).json({ error: 'Push xabarnoma yuborilmadi' });
        });
});

// ---- socket.io: autentifikatsiya va chat (bir marta, top-level) ----
function cookieValue(header, name) {
    if (!header) return null;
    for (const part of String(header).split(';')) {
        const i = part.indexOf('=');
        if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
    }
    return null;
}

io.use((socket, next) => {
    const hs = socket.handshake;
    const token = (hs.auth && hs.auth.token) || hs.headers['x-web-token'] || cookieValue(hs.headers.cookie, 'x-web-token');
    if (!token) return next(new Error("Avtorizatsiyadan o'tilmagan"));
    try {
        socket.user = verifyToken(String(token));
        return next();
    } catch (err) {
        return next(new Error("Token noto'g'ri yoki muddati tugagan"));
    }
});

io.on('connection', (socket) => {
    const me = Number(socket.user.id);
    socket.join('user-' + me); // xabarlar faqat qabul qiluvchining xonasiga yuboriladi
    debugLog('socket ulandi:', socket.id);
    const sendLimiter = createLimiter({ windowMs: 10 * 1000, max: 20 });
    const key = socket.id;

    // Xabarlar yuborilganda. Jo'natuvchi doim autentifikatsiyadan o'tgan foydalanuvchi (message.from ga ishonilmaydi).
    socket.on('sendMessage', async(message) => {
        try {
            if (!sendLimiter.hit(key).allowed) return;
            const to = Number(message && message.to);
            const text = message && typeof message.text === 'string' ? message.text.trim() : '';
            if (!Number.isInteger(to) || to <= 0 || !text || text.length > 2000) return;
            const db = await dbp;
            const receiver = await db.user.getUser(to);
            if (!receiver) return;
            let newMessage = {
                id: generateId(),
                to_user: to,
                from_user: me,
                text: text,
                is_read: false,
                date: parseDate(new Date()),
                is_reply: false
            };
            const result = await db.message.addMessage(newMessage);
            if (result && result.error) return;
            io.to('user-' + to).to('user-' + me).emit('newMessage-' + to, newMessage);
        } catch (err) {
            console.error('sendMessage xatolik:', err.message);
        }
    });
    socket.on('chatHistory', async(user) => {
        try {
            if (!sendLimiter.hit(key).allowed) return;
            // Faqat o'z yozishmalari (administrator boshqa foydalanuvchini so'rashi mumkin)
            const requested = Number(user && typeof user === 'object' ? user.id : user);
            const userId = Number.isInteger(requested) && canAccessUser(socket.user, requested) ? requested : me;
            let query = {
                $or: [
                    { to_user: userId },
                    { from_user: userId },
                ]
            };
            if (user && typeof user.date === 'string' && user.date.length <= 40) {
                query.date = { $gt: user.date }; // shu sanadan keyingi xabarlar
            }
            const db = await dbp;
            const result = await db.message.getMessageForObj(query);
            io.to('user-' + me).emit('getChatHistory-' + userId, result);
        } catch (err) {
            console.error('chatHistory xatolik:', err.message);
        }
    });
    // Socketni yopish
    socket.on('disconnect', () => {
        debugLog('socket uzildi:', socket.id);
    });
});

// ---- xatoliklarni qayta ishlash ----
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: "JSON noto'g'ri formatda yuborildi." });
    }
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({ error: "So'rov hajmi juda katta." });
    }
    if (err && err.name === 'MulterError') {
        return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: "Fayl yuklashda xatolik: " + err.message });
    }
    if (err && err.status && err.status < 500) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error('Server xatoligi:', err && err.message);
    return res.status(err && err.status ? err.status : 500).json({ error: "serverda xatolik mavjut  keyinroq urinib ko'ring." });
});

// ---- ishga tushirish: avval bazalar tayyor bo'ladi, keyin tinglash boshlanadi ----
async function main() {
    try {
        await dbp;
    } catch (err) {
        console.error("Bazaga ulanib bo'lmadi:", err && err.message);
        process.exit(1);
    }
    http.listen(config.port, function() {
        console.log("Server ishga tushdi, port: " + config.port);
    });
}

function shutdown() {
    http.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

main();
