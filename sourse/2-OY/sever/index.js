var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require('cors');
var path = require('path');
var db = require('./SuperDb/main');
var parseDate = require('./resurs/funtion/formatDate');
setTimeout(async() => { db = await db }, 100);

// const { createProxyMiddleware } = require('http-proxy-middleware');

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
var authMessage = require('./routers/message');


//use  plagins
app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));


//use  api routers
// app.use((req, res, next) => {
//     next();
// });
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

app.get('/chat', async(req, res) => {
    io.on('connection', (socket) => {
        console.log('Foydalanuvchi ulandi:', socket.id);
        // Xabarlar yuborilganda
        socket.on('sendMessage', async(message) => {
            console.log('Xabar qabul qilindi:', message);
            let newMessage = {
                id: generateId(),
                to_user: message.to,
                from_user: message.from,
                text: message.text,
                is_read: false,
                date: parseDate(new Date()),
                is_reply: false
            };
            let result = db.message.addMessage(newMessage);
            // Barcha foydalanuvchilarga xabarni yuborish
            io.emit('newMessage-' + message.to, newMessage);
        });
        socket.on('chatHistory', async(user) => {
            let userId = Number(user.id || user);
            console.log('Xabar qabul qilindi(tarix chat):', user);
            let query = {
                $or: [
                    { to_user: userId },
                    { from_user: userId },
                ]
            };
            if (user.date) {
                query.$or.push({ date: user.date });
            }
            let result = await db.message.getMessageForObj(newMessage);
            // Barcha foydalanuvchilarga xabarni yuborish
            io.emit('getChatHistory-' + userId, result);
        });
        // Socketni yopish
        socket.on('disconnect', () => {
            console.log('Foydalanuvchi chiqdi:', socket.id);
        });
    });
})


// http.listen(3000, function() {
//     console.log("3000 port eshtilyapti.")
// });
http.listen(process.env.PORT || 3000, async() => {
    console.log((process.env.PORT || 3000) + " port eshtilyapti.")
});