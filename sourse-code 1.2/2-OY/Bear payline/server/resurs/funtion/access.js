// Ruxsat yordamchilari (sof funksiyalar).
function isAdmin(user) {
    return !!user && user.role === 'admin';
}
// Admin hammaga, oddiy foydalanuvchi faqat o'ziga kira oladi.
function canAccessUser(user, iduser) {
    return isAdmin(user) || (!!user && Number(user.id) === Number(iduser));
}
module.exports = { isAdmin, canAccessUser };
