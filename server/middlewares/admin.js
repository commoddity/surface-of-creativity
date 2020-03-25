module.exports._ensureAdmin = function (req, res, next) {
    if (req.user.isAdmin) {
        next();
    } else {
        res.redirect('/')
    }
}