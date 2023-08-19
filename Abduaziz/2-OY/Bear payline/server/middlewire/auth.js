const jwt = require('jsonwebtoken');
const jwt_my_key = process.env.JWT_MY_KEY || "***REMOVED***";

// const chekt = {
//     'student': ['add', 'get', 'all', 'uptade', 'delete'],
//     'user': ['add', 'get', 'all', 'uptade', 'delete'],
//     'category': ['add', 'get', 'all', 'uptade', 'delete'],
//     'teacher': ['add', 'get', 'all', 'uptade', 'delete'],
//     'presence': ['add', 'get', 'all', 'uptade', 'delete'],
//     'course': ['add', 'get', 'all', 'uptade', 'delete'],
//     'paymentNumber': ['get', 'all', 'uptade', 'delete'],
//     'group': ['add', 'get', 'all', 'uptade', 'delete'],
//     'payments': ['add', 'get', 'all', 'uptade', 'delete'],
//     'studentHasGroup': ['add', 'get', 'all', 'uptade', 'delete']
// }



module.exports = async function(req, res, next) {
    return next();
    let path_req = req.originalUrl.split('/');
    const token = req.header('x-web-token');
    try {
        const expiredAt = jwt.decode(token).exp;
        const now = Math.floor(Date.now() / 1000);
        if (expiredAt < now) {
            console.log('Token yaroqsiz');
            return res.status(401).json({ error: "autorizatsiya eskirgan!" })
        }
        const user = jwt.verify(token, jwt_my_key);
        if (!(user.licence[path_req[2]] ? user.licence[path_req[2]].includes(path_req[3]) : false)) {
            return res.status(400).json({ error: "ush bu foydalanuvchi bu bo'limdan foydalana olmaydi." });
        }
        if (user.limit.count <= 0 && (new Date()).valueOf() < user.limit.time) {
            return res.status(429).json({ error: "juda ko'p so'rovlar  bo'ldi. 1 sekuntdan keyin qaytatdan urinib ko'ring." });
        } else if ((new Date()).valueOf() > user.limit.time) {
            user.limit.count = 100;
        }
        req.user = user;
        return next();
    } catch (err) {
        const { message } = err;
        if (message == "jwt must be provided") {
            return res.status(400).json({ error: "web token jonatilmagan!" })
        } else {
            return res.status(401).json({ error: "ushbu foydalanuvchi autorizatsiya qilmagan!" })
        }
    }
}