var express = require('express');
const cors = require('cors');
var path = require('path');
var app = express();

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

app.listen(3000, async() => {
    console.log("3000 port eshtilyapti.")
});